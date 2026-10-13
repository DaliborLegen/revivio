import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Pogoji uporabe | Revivio",
  description: "Pogoji uporabe storitve Revivio in naročnin.",
  alternates: { canonical: "/pogoji" },
};

export default function Pogoji() {
  return (
    <LegalShell title="Pogoji uporabe" updated="13. 10. 2026">
      <h2>Ponudnik</h2>
      <p>
        AI PRO Solutions d.o.o., Ulica Svobode 65, 6330 Piran, Slovenija, davčna številka 84674423,{" "}
        <a href="mailto:info@aiprosolutions.si">info@aiprosolutions.si</a>.
      </p>

      <h2>Storitev</h2>
      <p>
        Revivio s pomočjo umetne inteligence obnovi in pobarva stare fotografije. Rezultat je odvisen od kakovosti izvirnika,
        zato ne jamčimo za popolnost obnove. Za vsako obnovo se porabi en kredit.
      </p>

      <h2>Paketi in plačilo</h2>
      <ul>
        <li>Brezplačni paket: 1 obnova.</li>
        <li>
          Plačljivi paketi so mesečne naročnine: Začetni 4,99 € (5 obnov), Pro 9,99 € (30 obnov) in Business 24,99 € (100
          obnov) na mesec.
        </li>
        <li>
          <b>Naročnina se samodejno podaljša vsak mesec</b> in se zaračuna na plačilno sredstvo, ki ste ga vnesli. Ob
          podaljšanju dobite nove kredite za naslednji mesec, neporabljeni krediti se ne prenašajo.
        </li>
        <li>Plačila obdeluje Stripe. Cene so končne.</li>
      </ul>

      <h2>Preklic naročnine</h2>
      <p>
        Naročnino prekličete kadarkoli sami: <b>Profil, Upravljaj naročnino, Prekliči</b>. Preklic velja do konca že plačanega
        meseca, do takrat lahko porabite preostale kredite. Nato se račun samodejno vrne na brezplačni paket. Že plačanega
        obdobja ne vračamo, razen če to zahteva zakon.
      </p>

      <h2>Pravica do odstopa</h2>
      <p>
        Ker gre za digitalno storitev, ki se začne izvajati takoj po nakupu, ob nakupu soglašate z začetkom izvajanja pred
        iztekom 14-dnevnega roka za odstop in se zavedate, da s prvo uporabljeno obnovo izgubite pravico do odstopa od
        pogodbe. Če po nakupu še niste porabili nobenega kredita, lahko v 14 dneh odstopite s sporočilom na{" "}
        <a href="mailto:info@aiprosolutions.si">info@aiprosolutions.si</a> in vrnemo vam plačilo.
      </p>

      <h2>Vaše fotografije</h2>
      <ul>
        <li>Nalagate lahko samo fotografije, za katere imate pravico uporabe.</li>
        <li>Prepovedane so nezakonite vsebine in vsebine, ki kršijo pravice drugih.</li>
        <li>Fotografije in rezultati ostanejo vaši. Uporabimo jih samo za izvedbo storitve, kot opisuje politika zasebnosti.</li>
      </ul>

      <h2>Odgovornost</h2>
      <p>
        Storitev nudimo takšno, kot je. Za posredno škodo ne odgovarjamo, kolikor to dovoljuje zakon. Pravice potrošnikov po
        veljavni zakonodaji ostanejo nespremenjene.
      </p>

      <h2>Spori</h2>
      <p>
        Velja pravo Republike Slovenije. Spore rešujemo sporazumno, sicer je pristojno sodišče po sedežu ponudnika, razen če
        zakon za potrošnike določa drugače.
      </p>
    </LegalShell>
  );
}
