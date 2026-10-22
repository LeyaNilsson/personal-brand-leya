const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissionsByIp = new Map();

function clean(value, maxLength) {
    return typeof value === "string"
        ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength)
        : "";
}

function rateLimited(ip) {
    const now = Date.now();
    
    // Säkrare städning av gamla IP-adresser utan att störa loopen
    const expiredIps = [];
    for (const [knownIp, entry] of submissionsByIp) {
        if (now - entry.startedAt >= WINDOW_MS) {
            expiredIps.push(knownIp);
        }
    }
    expiredIps.forEach(expiredIp => submissionsByIp.delete(expiredIp));

    const entry = submissionsByIp.get(ip);
    if (!entry || now - entry.startedAt >= WINDOW_MS) {
        submissionsByIp.set(ip, { startedAt: now, count: 1 });
        return false;
    }
    
    entry.count += 1;
    return entry.count > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Använd POST för att skicka formuläret." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    
    // Honeypot-fält för spam (om fältet är ifyllt är det en bot)
    if (clean(body.website, 200)) return res.status(200).json({ ok: true });

    const ip = clean(req.headers["x-real-ip"] || req.headers["x-forwarded-for"]?.split(",")[0] || "unknown", 80);
    if (rateLimited(ip)) {
        return res.status(429).json({ message: "För många försök på kort tid. Vänta en stund och försök igen." });
    }

    const firstname = clean(body.firstname, 100);
    const lastname = clean(body.lastname, 100);
    const email = clean(body.email, 254);
    const company = clean(body.company, 200);
    const message = clean(body.message, 5000);
    
    // KORRIGERAT REGEX: Tagit bort '\' innan '\$'
    if (!firstname || !lastname || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(email)) {
        return res.status(400).json({ message: "Kontrollera att obligatoriska fält är ifyllda och att e-postadressen är giltig." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || "leya@sandtex.se";

    // Säkerställ att du har lagt till din domän i Resend, annars måste CONTACT_FROM_EMAIL vara "onboarding@resend.dev"
    const companyLine = company ? `Företag: ${company}\n` : "";
    const emailPayload = {
        from: CONTACT_FROM_EMAIL || "onboarding@resend.dev",
        to: [to],
        reply_to: email,
        subject: `Kontakt från hemsidan: ${firstname} ${lastname}`,
        text: `Namn: ${firstname} ${lastname}\nE-post: ${email}\n${companyLine}\nMeddelande:\n${message}`
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailPayload),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Resend Error Detaljer:", JSON.stringify(errorData));
            console.error("Resend rejected contact email with status", response.status);
            return res.status(502).json({ message: "Mejlet kunde inte skickas just nu. Försök igen eller mejla mig direkt." });
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Contact email request failed", error.name);
        return res.status(error.name === "AbortError" ? 504 : 502).json({
            message: "Kunde inte skicka mejlet just nu. Dina uppgifter finns kvar; försök igen eller mejla mig direkt."
        });
    } finally {
        clearTimeout(timeout);
    }
}
