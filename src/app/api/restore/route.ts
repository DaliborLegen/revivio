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
      credits_remaining: 3,
      credits_per_month: 3,
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
              text: `You are a professional photo restoration AI. Restore and enhance this photograph:
- Fix any damage, scratches, tears, stains, or artifacts
- Improve clarity and sharpness
- If the photo is black and white, colorize it naturally
- Correct fading and improve contrast
- Enhance resolution and details
- Keep the original composition and subjects intact
- Make it look like a high-quality modern photograph while preserving its historical character

Return ONLY the restored image, no text.`,
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

    // Deduct credit and log restoration
    const currentCredits = profile?.credits_remaining ?? 3;

    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .update({
          credits_remaining: currentCredits - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id),
      supabaseAdmin.from("restorations").insert({
        user_id: user.id,
        status: "completed",
        original_size: file.size,
        mime_type: file.type,
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
