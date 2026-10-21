// ==========================================================================
// LEYA NILSSON – Interaktiv funktionalitet (felsökt version)
// ==========================================================================

const KONTAKT_ENDPOINT = "/api/contact";
const KONTAKT_FORMAT = "form"; // "form" = application/x-www-form-urlencoded, "json" = application/json
const EPOST = "leya@sandtex.se";

// 0 · Färgläge – sätts direkt för att undvika blink vid laddning
function lasTema() {
    try {
        const sparat = localStorage.getItem("leya-tema");
        if (sparat === "dark" || sparat === "light") return sparat;
    } catch {
        // Lokal lagring blockerad – använd systeminställning.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.documentElement.dataset.theme = lasTema();

function init() {
    initTema();
    initMobilmeny();
    initBanner();
    initScrollskugga();
    initKopieraEpost();
    initKontaktformular();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// --------------------------------------------------------------------------
function initTema() {
    // OBS: id:t måste matcha HTML exakt. Undvik å/ä/ö i id – använd t.ex. "temavaxlare".
    const knapp = document.getElementById("temavaxlare") || document.getElementById("temaväxlare");
    if (!knapp) return;

    const ikonMane = knapp.querySelector(".temaikon-man");
    const ikonSol = knapp.querySelector(".temaikon-sol");

    function uppdatera(morkt) {
        document.documentElement.dataset.theme = morkt ? "dark" : "light";
        const etikett = morkt ? "Aktivera ljust läge" : "Aktivera mörkt läge";
        knapp.setAttribute("aria-label", etikett);
        knapp.setAttribute("title", etikett);
        knapp.setAttribute("aria-pressed", String(morkt));
        if (ikonMane) ikonMane.hidden = morkt;
        if (ikonSol) ikonSol.hidden = !morkt;
    }

    uppdatera(document.documentElement.dataset.theme === "dark");

    knapp.addEventListener("click", () => {
        const morkt = document.documentElement.dataset.theme !== "dark";
        uppdatera(morkt);
        try {
            localStorage.setItem("leya-tema", morkt ? "dark" : "light");
        } catch {
            // Växlingen fungerar även om webbläsaren blockerar lokal lagring.
        }
    });
}

// 1 · Hamburgarmeny (mobil)
function initMobilmeny() {
    const hamburgare = document.getElementById("hamburgare");
    const mobilmeny = document.getElementById("mobilmeny");
    if (!hamburgare || !mobilmeny) return;

    const text = hamburgare.querySelector(".hamburgare-text");

    function satt(oppet, aterstallFokus = false) {
        hamburgare.classList.toggle("aktiv", oppet);
        mobilmeny.classList.toggle("oppet", oppet);
        hamburgare.setAttribute("aria-expanded", String(oppet));
        hamburgare.setAttribute("aria-label", oppet ? "Stäng meny" : "Öppna meny");
        mobilmeny.setAttribute("aria-hidden", String(!oppet));
        mobilmeny.inert = !oppet;
        if (text) text.textContent = oppet ? "Stäng" : "Meny";
        document.body.style.overflow = oppet ? "hidden" : "";
        if (aterstallFokus) hamburgare.focus();
    }

    // Startläge: stängd (sätter inert/aria-hidden korrekt direkt)
    satt(false);

    hamburgare.addEventListener("click", () => {
        satt(!hamburgare.classList.contains("aktiv"));
    });

    mobilmeny.querySelectorAll(".mobilmeny-lank").forEach(lank => {
        lank.addEventListener("click", () => satt(false));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && hamburgare.classList.contains("aktiv")) {
            satt(false, true);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100 && hamburgare.classList.contains("aktiv")) {
            satt(false);
        }
    }, { passive: true });
}

// 2 · Stäng toppbanner
function initBanner() {
    const stang = document.getElementById("stang-banner");
    const banner = document.getElementById("toppbanner");
    if (!stang || !banner) return;

    stang.addEventListener("click", () => {
        banner.style.height = banner.offsetHeight + "px";
        banner.style.overflow = "hidden";
        banner.style.transition = "height 0.3s ease, padding 0.3s ease";
        requestAnimationFrame(() => {
            banner.style.height = "0";
            banner.style.paddingTop = "0";
            banner.style.paddingBottom = "0";
        });
        setTimeout(() => banner.remove(), 350);
    }, { once: true });
}

// 3 · Sidhuvud-skugga vid scroll
function initScrollskugga() {
    const sidhuvud = document.getElementById("sidhuvud");
    if (!sidhuvud) return;

    const uppdatera = () => sidhuvud.classList.toggle("scrollad", window.scrollY > 20);
    window.addEventListener("scroll", uppdatera, { passive: true });
    uppdatera(); // korrekt läge även om sidan laddas halvvägs ner
}

// 4 · Kopiera e-postadress
function initKopieraEpost() {
    const knapp = document.getElementById("kopiera-epost");
    if (!knapp) return;

    const originalText = knapp.textContent;
    let timer;

    function visaKopierad() {
        knapp.textContent = "Kopierad! \u2713";
        clearTimeout(timer);
        timer = setTimeout(() => {
            knapp.textContent = originalText;
        }, 2500);
    }

    function reservKopiering() {
        const el = document.createElement("textarea");
        el.value = EPOST;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch {
            ok = false;
        }
        document.body.removeChild(el);
        return ok;
    }

    knapp.addEventListener("click", async () => {
        try {
            // navigator.clipboard saknas på http (ej https) – då kastas fel synkront,
            // därför try/await i stället för .then().catch().
            await navigator.clipboard.writeText(EPOST);
            visaKopierad();
        } catch {
            if (reservKopiering()) {
                visaKopierad();
            } else {
                knapp.textContent = EPOST; // visa adressen så den kan kopieras manuellt
                clearTimeout(timer);
                timer = setTimeout(() => {
                    knapp.textContent = originalText;
                }, 4000);
            }
        }
    });
}

// 5 · Kontaktformulär
function initKontaktformular() {
    const form = document.getElementById("kontaktform");
    if (!form) return;

    const status = document.getElementById("kontaktform-status");
    const skicka = document.getElementById("kontaktform-skicka");
    const knappText = skicka ? skicka.textContent : "Skicka meddelande";

    function visaStatus(text, state) {
        if (!status) return;
        status.textContent = text;
        status.dataset.state = state;
    }

    form.addEventListener("submit", async event => {
        // Alltid först – hindrar omladdning/hopp till toppen.
        event.preventDefault();

        if (!form.reportValidity()) return;
        if (skicka?.disabled) return; // förhindra dubbelskick

        const values = Object.fromEntries(new FormData(form).entries());

        visaStatus("Skickar ditt meddelande…", "sending");
        if (skicka) {
            skicka.disabled = true;
            skicka.setAttribute("aria-busy", "true");
            skicka.classList.add("skickar");
            skicka.textContent = "Skickar…";
        }

        try {
            const json = KONTAKT_FORMAT === "json";
            const response = await fetch(KONTAKT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": json
                        ? "application/json"
                        : "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: json
                    ? JSON.stringify(values)
                    : new URLSearchParams(values).toString()
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Meddelandet kunde inte skickas just nu.");
            }

            form.reset();
            visaStatus("Tack för ditt meddelande! Jag återkommer så snart jag kan.", "success");
        } catch (error) {
            // TypeError = nätverksfel/CORS/ingen server
            const natverk = error instanceof TypeError;
            visaStatus(
                natverk
                    ? "Kunde inte nå servern. Kontrollera uppkopplingen eller mejla mig direkt."
                    : (error.message || "Ett fel uppstod. Försök igen eller mejla mig direkt."),
                "error"
            );
        } finally {
            if (skicka) {
                skicka.disabled = false;
                skicka.removeAttribute("aria-busy");
                skicka.classList.remove("skickar");
                skicka.textContent = knappText;
            }
        }
    });
}
