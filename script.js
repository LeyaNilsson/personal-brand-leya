// ==========================================================================
// LEYA NILSSON – Interaktiv funktionalitet
// ==========================================================================

// 1 · Fäll ut / dölj ytterligare bakgrundsinformation
const knapp = document.querySelector("#visa-mer");
const mer = document.querySelector("#mer");

if (knapp && mer) {
    mer.classList.add("gomd");

    function visaMer() {
        mer.classList.toggle("gomd");
        if (mer.classList.contains("gomd")) {
            knapp.textContent = "Läs mer om min bakgrund";
            knapp.setAttribute("aria-expanded", "false");
        } else {
            knapp.textContent = "Visa mindre";
            knapp.setAttribute("aria-expanded", "true");
        }
    }

    knapp.addEventListener("click", visaMer);
}

// 2 · Snabbkopiering av e-postadress med ett klick
const kopiera = document.querySelector("#kopiera");

if (kopiera) {
    function kopieraMail() {
        const epost = "leya@sandtex.se";
        navigator.clipboard.writeText(epost).then(() => {
            const originalText = kopiera.textContent;
            kopiera.textContent = "Kopierad! ✓";
            kopiera.style.color = "#c5a676";
            kopiera.style.borderColor = "#c5a676";

            setTimeout(() => {
                kopiera.textContent = originalText;
                kopiera.style.color = "";
                kopiera.style.borderColor = "";
            }, 2500);
        }).catch(err => {
            console.error("Kunde inte kopiera e-post: ", err);
        });
    }

    kopiera.addEventListener("click", kopieraMail);
}