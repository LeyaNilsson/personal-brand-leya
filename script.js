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
    hamburgare.addEventListener("click", () => {
        const oppet = hamburgare.classList.toggle("aktiv");
        mobilmeny.classList.toggle("oppet");
        hamburgare.setAttribute("aria-expanded", oppet);
        mobilmeny.setAttribute("aria-hidden", !oppet);
        document.body.style.overflow = oppet ? "hidden" : "";
    });

    // Stäng menyn när en länk klickas
    document.querySelectorAll(".mobilmeny-lank").forEach(lank => {
        lank.addEventListener("click", () => {
            hamburgare.classList.remove("aktiv");
            mobilmeny.classList.remove("oppet");
            hamburgare.setAttribute("aria-expanded", "false");
            mobilmeny.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        });
    });
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
