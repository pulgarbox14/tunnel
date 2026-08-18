/**
 * Envoi d'emails transactionnels (code d'accès après achat).
 *
 * Deux fournisseurs supportés — il suffit de définir UNE clé API :
 *   BREVO_API_KEY   → https://www.brevo.com  (300 emails/jour gratuits)
 *   RESEND_API_KEY  → https://resend.com     (excellent taux de délivrabilité)
 *
 * MAIL_FROM_EMAIL / MAIL_FROM_NAME : expéditeur (à vérifier chez le fournisseur
 * pour une bonne délivrabilité — idéalement une adresse de ton propre domaine).
 */

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL ?? "no-reply@capsurmonavenir.bj";
const FROM_NAME = process.env.MAIL_FROM_NAME ?? "Cap sur monAvenir";

function accessCodeHtml(name: string, code: string, loginUrl: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#000;padding:32px 16px;color:#fff;">
    <div style="max-width:520px;margin:0 auto;background:#0d0d0d;border:2px solid #fcd116;border-radius:16px;padding:32px 24px;">
      <div style="height:4px;background:linear-gradient(90deg,#008751 33%,#fcd116 33% 66%,#e3132b 66%);border-radius:2px;margin-bottom:24px;"></div>
      <h1 style="color:#e3132b;font-size:20px;text-transform:uppercase;margin:0 0 16px;">Bienvenue dans Cap sur monAvenir 🎓</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.6;">Bonjour <strong style="color:#fff;">${name}</strong>,</p>
      <p style="color:#ccc;font-size:14px;line-height:1.6;">Ton paiement est confirmé. Voici ton code d'accès personnel à l'espace membre :</p>
      <div style="background:#000;border:2px dashed #fcd116;border-radius:12px;text-align:center;padding:18px;margin:20px 0;">
        <span style="color:#fcd116;font-size:26px;font-weight:bold;letter-spacing:3px;">${code}</span>
      </div>
      <p style="color:#ccc;font-size:13px;line-height:1.6;">⚠️ Ce code est <strong style="color:#fff;">strictement personnel</strong> : il se lie à ton appareil dès ta première connexion et ne fonctionnera pas sur les téléphones d'autres personnes.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${loginUrl}" style="background:#fcd116;color:#1a1200;text-decoration:none;font-weight:bold;text-transform:uppercase;padding:14px 32px;border-radius:999px;display:inline-block;">Accéder à mes vidéos</a>
      </div>
      <p style="color:#777;font-size:12px;">Si tu n'es pas à l'origine de cet achat, ignore cet email.</p>
    </div>
  </div>`;
}

export async function sendAccessCodeEmail(params: {
  to: string;
  name: string;
  code: string;
}): Promise<{ sent: boolean; provider?: string; error?: string }> {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const subject = "🎓 Ton code d'accès — Cap sur monAvenir";
  const html = accessCodeHtml(params.name, params.code, `${appUrl}/connexion`);

  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [params.to],
          subject,
          html,
        }),
      });
      if (!res.ok) return { sent: false, provider: "resend", error: await res.text() };
      return { sent: true, provider: "resend" };
    }

    if (process.env.BREVO_API_KEY) {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: params.to, name: params.name }],
          subject,
          htmlContent: html,
        }),
      });
      if (!res.ok) return { sent: false, provider: "brevo", error: await res.text() };
      return { sent: true, provider: "brevo" };
    }

    return { sent: false, error: "Aucun fournisseur d'email configuré (BREVO_API_KEY ou RESEND_API_KEY)." };
  } catch (e) {
    return { sent: false, error: String(e) };
  }
}
