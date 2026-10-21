// ==========================================================================
// LEYA NILSSON – Interaktiv funktionalitet
// ==========================================================================

// 0 · Färgläge
const temavaxlare = document.getElementById("temaväxlare");
const sparatTema = (() => {
    try {
        return localStorage.getItem("leya-tema");
    } catch {
        return null;
    }
})();

function sattTema(morkt) {
    document.documentElement.dataset.theme = morkt ? "dark" : "light";
    if (!temavaxlare) return;

    const etikett = morkt ? "Aktivera ljust läge" : "Aktivera mörkt läge";
    temavaxlare.setAttribute("aria-label", etikett);
    temavaxlare.setAttribute("title", etikett);
    temavaxlare.setAttribute("aria-pressed", String(morkt));
    temavaxlare.querySelector(".temaikon-man").hidden = morkt;
    temavaxlare.querySelector(".temaikon-sol").hidden = !morkt;
}

sattTema(sparatTema === "dark");

if (temavaxlare) {
    temavaxlare.addEventListener("click", () => {
        const morkt = document.documentElement.dataset.theme !== "dark";
        sattTema(morkt);
        try {
            localStorage.setItem("leya-tema", morkt ? "dark" : "light");
        } catch {
            // Växlingen fungerar även om webbläsaren blockerar lokal lagring.
        }
    });
}

// 1 · Hamburgarmeny (mobil)
const hamburgare = document.getElementById("hamburgare");
const mobilmeny = document.getElementById("mobilmeny");

if (hamburgare && mobilmeny) {
    function sattMobilmeny(oppet, aterstallFokus = false) {
        hamburgare.classList.toggle("aktiv", oppet);
        mobilmeny.classList.toggle("oppet", oppet);
        hamburgare.setAttribute("aria-expanded", String(oppet));
        hamburgare.setAttribute("aria-label", oppet ? "Stäng meny" : "Öppna meny");
        mobilmeny.setAttribute("aria-hidden", String(!oppet));
        mobilmeny.inert = !oppet;
        hamburgare.querySelector(".hamburgare-text").textContent = oppet ? "Stäng" : "Meny";
        document.body.style.overflow = oppet ? "hidden" : "";

        if (aterstallFokus) hamburgare.focus();
    }

    hamburgare.addEventListener("click", () => {
        sattMobilmeny(!hamburgare.classList.contains("aktiv"));
    });

    // Stäng menyn när en länk väljs.
    document.querySelectorAll(".mobilmeny-lank").forEach(lank => {
        lank.addEventListener("click", () => {
            sattMobilmeny(false);
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && hamburgare.classList.contains("aktiv")) {
            sattMobilmeny(false, true);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100 && hamburgare.classList.contains("aktiv")) {
            sattMobilmeny(false);
        }
    }, { passive: true });
}
// 2 · Stäng toppbanner
const stangBanner = document.getElementById("stang-banner");
const toppbanner = document.getElementById("toppbanner");

if (stangBanner && toppbanner) {
    stangBanner.addEventListener("click", () => {
        toppbanner.style.height = toppbanner.offsetHeight + "px";
        toppbanner.style.overflow = "hidden";
        toppbanner.style.transition = "height 0.3s ease, padding 0.3s ease";
        requestAnimationFrame(() => {
            toppbanner.style.height = "0";
            toppbanner.style.paddingTop = "0";
            toppbanner.style.paddingBottom = "0";
        });
        setTimeout(() => toppbanner.remove(), 350);
    });
}

// 3 · Sidhuvud-skugga vid scroll
const sidhuvud = document.getElementById("sidhuvud");

if (sidhuvud) {
    window.addEventListener("scroll", () => {
        sidhuvud.classList.toggle("scrollad", window.scrollY > 20);
    }, { passive: true });
}

// 4 · Kopiera e-postadress
const kopieraKnapp = document.getElementById("kopiera-epost");

if (kopieraKnapp) {
    kopieraKnapp.addEventListener("click", () => {
        navigator.clipboard.writeText("leya@sandtex.se").then(() => {
            const original = kopieraKnapp.textContent;
            kopieraKnapp.textContent = "Kopierad! \u2713";
            setTimeout(() => {
                kopieraKnapp.textContent = original;
            }, 2500);
        }).catch(() => {
            // Fallback: skapa tillfälligt element
            const el = document.createElement("textarea");
            el.value = "leya@sandtex.se";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            kopieraKnapp.textContent = "Kopierad! \u2713";
            setTimeout(() => {
                kopieraKnapp.textContent = "Kopiera e-post";
            }, 2500);
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // 5 · Kontaktformulär via säker serverfunktion
const kontaktform = document.getElementById('kontaktform');

if (kontaktform) {
    const status = document.getElementById('kontaktform-status');
    const skicka = document.getElementById('kontaktform-skicka');

    kontaktform.addEventListener('submit', async event => {
        event.preventDefault();
        
        if (!kontaktform.reportValidity()) return;

        const values = Object.fromEntries(new FormData(kontaktform).entries());

        status.textContent = 'Skickar ditt meddelande…';
        status.dataset.state = 'sending';
        skicka.disabled = true;
        skicka.setAttribute('aria-busy', 'true');
        skicka.classList.add('skickar');
        skicka.textContent = 'Skickar…';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) throw new Error(result.message || 'Meddelandet kunde inte skickas just nu.');

            kontaktform.reset();
            status.textContent = 'Tack för ditt meddelande! Jag återkommer så snart jag kan.';
            status.dataset.state = 'success';

        } catch (error) {
            status.textContent = error.message || 'Ett fel uppstod. Försök igen eller mejla mig direkt.';
            status.dataset.state = 'error';
        } finally {
            skicka.disabled = false;
            skicka.removeAttribute('aria-busy');
            skicka.classList.remove('skickar');
            skicka.textContent = 'Skicka meddelande';
        }
    });


}


