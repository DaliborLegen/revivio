import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { CookieSettingsButton } from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: "Politika zasebnosti | Revivio",
  description: "Kako Revivio obdeluje vaše osebne podatke in fotografije.",
  alternates: { canonical: "/zasebnost" },
};

export default function Zasebnost() {
  return (
    <LegalShell title="Politika zasebnosti" updated="13. 10. 2026">
      <h2>Upravljavec</h2>
      <p>
        Storitev Revivio (revivio.si) upravlja AI PRO Solutions d.o.o., Ulica Svobode 65, 6330 Piran, Slovenija, davčna
        številka 84674423. Kontakt: <a href="mailto:info@aiprosolutions.si">info@aiprosolutions.si</a>, +386 40 223 883.
      </p>

      <h2>Katere podatke obdelujemo in zakaj</h2>
      <ul>
        <li>
          <b>Uporabniški račun:</b> e-poštni naslov in geslo (shranjeno šifrirano) ali prijava z Google računom. Potrebno za
          izvajanje storitve (člen 6(1)(b) GDPR).
        </li>
        <li>
          <b>Fotografije:</b> fotografije, ki jih naložite, in obnovljene različice. Obdelamo jih, da izvedemo obnovo, in jih
          hranimo v vašem profilu, da jih lahko prenesete. Fotografijo lahko kadarkoli izbrišete v profilu, s tem se izbrišeta
          izvirnik in obnovljena različica. Ob izbrisu računa se izbrišejo vse vaše fotografije. Fotografij ne uporabljamo za
          nič drugega in jih ne objavljamo.
        </li>
        <li>
          <b>Naročnina in plačila:</b> paket, stanje kreditov in identifikator stranke pri Stripu. Podatkov o plačilni kartici
          ne vidimo in ne hranimo, obdela jih Stripe. Računovodske podatke hranimo, kolikor zahteva zakon (člen 6(1)(c) GDPR).
        </li>
        <li>
          <b>Analitika (samo s soglasjem):</b> Google Analytics 4 meri obiske z analitičnimi piškotki šele, ko kliknete
          »Sprejmi« (člen 6(1)(a) GDPR).
        </li>
        <li>
          <b>Tehnični dnevniki:</b> IP naslov, čas in zahtevana stran, potrebni za delovanje in varnost (člen 6(1)(f) GDPR).
        </li>
      </ul>

      <h2>Obdelovalci</h2>
      <ul>
        <li>Supabase (podatkovna baza, prijava in hramba fotografij).</li>
        <li>Google Gemini API (obdelava fotografije za obnovo).</li>
        <li>Stripe (plačila in naročnine).</li>
        <li>Vercel (gostovanje strani).</li>
        <li>Google Ireland Ltd. (Google Analytics), samo s soglasjem.</li>
      </ul>
      <p>
        Pri ponudnikih s sedežem izven EU se prenos podatkov izvaja na podlagi standardnih pogodbenih klavzul EU ali sklepa o
        ustreznosti.
      </p>

      <h2>Piškotki</h2>
      <p>
        Nujni piškotki skrbijo za prijavo v račun. Analitični piškotki Google Analytics (<code>_ga</code>, <code>_ga_*</code>,
        do 2 let) se nastavijo samo po vašem soglasju. Izbiro lahko spremenite tukaj:{" "}
        <CookieSettingsButton className="cursor-pointer text-[#d4a054] underline underline-offset-2" label="nastavitve piškotkov" />.
      </p>

      <h2>Vaše pravice</h2>
      <p>
        Imate pravico do dostopa, popravka, izbrisa, omejitve obdelave, ugovora, prenosljivosti in preklica soglasja. Zahtevo
        pošljite na <a href="mailto:info@aiprosolutions.si">info@aiprosolutions.si</a>, odgovorimo v enem mesecu. Pritožbo
        lahko vložite pri Informacijskem pooblaščencu (Dunajska cesta 22, 1000 Ljubljana,{" "}
        <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer">
          www.ip-rs.si
        </a>
        ).
      </p>
    </LegalShell>
  );
}
