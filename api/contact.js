// HubSpot standard contact property names used by the form.
const HUBSPOT_FIELD_NAMES = {
    firstname: "firstname",
    lastname: "lastname",
    email: "email",
    company: "company",
    message: "message"
};

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

module.exports = async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Använd POST för att skicka formuläret." });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID || "149565964";
    const formId = process.env.HUBSPOT_FORM_ID || "e374a30c-7c1c-4e9d-9a41-73f79d2c1574";
    const body = req.body && typeof req.body === "object" ? req.body : {};
    // Honeypot: reject automated submissions; do not forward them to HubSpot.
    if (text(body.website, 200)) {
        return res.status(400).json({ message: "Formuläret kunde inte skickas." });
    }

    const values = {
        firstname: text(body.firstname, 100),
        lastname: text(body.lastname, 100),
        email: text(body.email, 254),
        company: text(body.company, 200),
        message: text(body.message, 5000)
    };
    if (!values.firstname || !values.lastname || !values.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        return res.status(400).json({ message: "Kontrollera att alla obligatoriska fält är ifyllda och att e-postadressen är giltig." });
    }

    const fields = Object.entries(values)
        .filter(([key, value]) => key !== "company" || value)
        .map(([key, value]) => ({ name: HUBSPOT_FIELD_NAMES[key], value }));
    const submittedAt = text(body.pageUri, 1000);
    const payload = {
        fields,
        context: {
            pageUri: submittedAt.startsWith("https://") ? submittedAt : "https://leyanilsson.vercel.app/",
            pageName: "Kontaktformulär – Leya Nilsson"
        }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const hubspotResponse = await fetch(
            `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portalId)}/${encodeURIComponent(formId)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        );

        if (!hubspotResponse.ok) {
            // Keep detailed HubSpot errors in server logs only; never expose submitted data.
            console.error("HubSpot Forms API returned status", hubspotResponse.status);
            return res.status(502).json({
                message: "HubSpot tog inte emot formuläret. Dina uppgifter finns kvar; försök igen eller mejla leya@sandtex.se."
            });
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("HubSpot Forms API request failed", error.name);
        return res.status(error.name === "AbortError" ? 504 : 502).json({
            message: "Kunde inte nå HubSpot just nu. Dina uppgifter finns kvar; försök igen eller mejla leya@sandtex.se."
        });
    } finally {
        clearTimeout(timeout);
    }
};

