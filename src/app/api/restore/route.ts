import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // Auth check
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Credit check
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("credits_remaining")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Create profile if missing (safety net)
    await supabaseAdmin.from("profiles").insert({
      id: user.id,
      email: user.email,
      plan: "free",
      credits_remaining: 1,
      credits_per_month: 1,
    });
  } else if (profile.credits_remaining <= 0) {
    return NextResponse.json(
      { error: "No credits remaining", code: "NO_CREDITS" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format. Use JPG, PNG or WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const ai = new GoogleGenAI({ apiKey });
    const force = formData.get("force") === "true";

    // Step 1: Analyze if the photo is old/damaged (skip if forced)
    if (!force) {
    const analysis = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: file.type,
              },
            },
            {
              text: `Analyze this image. Is it a CLEARLY MODERN photo that has absolutely NO connection to old/vintage photography?

Answer with ONLY a JSON object: {"isModern": true/false, "reason": "brief explanation in Slovenian"}

Return isModern: true ONLY for these cases:
- A modern smartphone selfie taken recently
- A screenshot of a website, app, or game
- Digital artwork, memes, or illustrations
- A photo clearly taken with a modern camera in recent years (sharp, high-res, modern subjects like smartphones, modern cars, etc.)

Return isModern: false (meaning: allow restoration) for ALL of these:
- Any black and white photograph
- Any sepia or yellowed photograph
- Any photo with scratches, tears, damage, or fading
- Any photo that LOOKS like it could be from before 2000
- Any photo of old subjects (vintage clothing, old buildings, old cars, historical scenes)
- Any photo that has already been colorized or partially restored
- Any scanned print or film photograph
- ANY photo where you are unsure — default to false

When in doubt, ALWAYS return false. Only block obviously modern digital photos.`,
            },
          ],
        },
      ],
    });

    const analysisText = analysis.candidates?.[0]?.content?.parts?.[0]?.text || "";
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        if (result.isModern === true) {
          return NextResponse.json(
            {
              error: result.reason || "Ta fotografija ne izgleda kot stara ali poškodovana. Naložite staro fotografijo za obnovo.",
              code: "NOT_OLD_PHOTO",
            },
            { status: 400 }
          );
        }
      }
    } catch {
      // If analysis fails, proceed with restoration anyway
    }
    } // end if (!force)

    // Step 2: Restore the photo
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: file.type,
              },
            },
            {
              text: `You are a world-class professional photo restoration and colorization AI. Your task is to fully restore and colorize this photograph.

COLORIZATION RULES (MOST IMPORTANT):
- You MUST colorize the ENTIRE image uniformly — every single pixel must be in full, natural color
- NEVER leave any part of the image in black and white, grayscale, or sepia
- ALL people, clothing, skin, hair, backgrounds, sky, ground, buildings, objects must be fully colorized
- Use historically accurate, realistic colors for the era the photo was taken
- Skin tones must be natural and realistic
- Sky should be blue, grass green, wood brown, etc.

RESTORATION RULES:
- Fix any damage, scratches, tears, stains, or artifacts
- Improve clarity and sharpness
- Correct fading and improve contrast
- Enhance resolution and details

PRESERVATION RULES:
- Do NOT alter clothing patterns, textures, or accessories — only add color to them
- Do NOT change facial features, hairstyles, or body proportions
- Keep the original composition, pose, and background intact
- Only enhance what is already there — never add, remove, or replace elements

Return ONLY the fully colorized and restored image, no text.`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["image", "text"],
      },
    });

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];

    const imagePart = parts.find((part) =>
      part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json(
        { error: "AI did not return an image. Please try again." },
        { status: 502 }
      );
    }

    // Deduct credit, save images, and log restoration
    const currentCredits = profile?.credits_remaining ?? 1;
    const restorationId = crypto.randomUUID();
    const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
    const restoredExt = imagePart.inlineData.mimeType?.includes("png") ? "png" : "jpg";

    // Upload original and restored images to Supabase Storage
    const originalPath = `${user.id}/${restorationId}/original.${ext}`;
    const restoredPath = `${user.id}/${restorationId}/restored.${restoredExt}`;

    const restoredBuffer = Buffer.from(imagePart.inlineData.data, "base64");

    await Promise.all([
      supabaseAdmin.storage
        .from("restorations")
        .upload(originalPath, Buffer.from(arrayBuffer), {
          contentType: file.type,
        }),
      supabaseAdmin.storage
        .from("restorations")
        .upload(restoredPath, restoredBuffer, {
          contentType: imagePart.inlineData.mimeType || "image/png",
        }),
    ]);

    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/restorations`;
    const originalUrl = `${baseUrl}/${originalPath}`;
    const restoredUrl = `${baseUrl}/${restoredPath}`;

    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .update({
          credits_remaining: currentCredits - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id),
      supabaseAdmin.from("restorations").insert({
        id: restorationId,
        user_id: user.id,
        status: "completed",
        original_size: file.size,
        mime_type: file.type,
        original_url: originalUrl,
        restored_url: restoredUrl,
      }),
    ]);

    return NextResponse.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
      creditsRemaining: currentCredits - 1,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Restore API error:", message, error);
    return NextResponse.json(
      { error: `Failed to process image: ${message}` },
      { status: 500 }
    );
  }
}
