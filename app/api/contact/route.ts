import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: "MCGuyane Contact <onboarding@resend.dev>",
      to: "preneuscliford@gmail.com",
      subject: `[Contact MCGuyane] ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📧 Nouveau message</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">MCGuyane - Formulaire de contact</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #374151;"><strong style="color: #667eea;">👤 Nom:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0; color: #374151;"><strong style="color: #667eea;">📧 Email:</strong> ${email}</p>
              <p style="margin: 0; color: #374151;"><strong style="color: #667eea;">📝 Sujet:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border: 2px solid #667eea; border-radius: 8px;">
              <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">Message:</h3>
              <p style="color: #4b5563; line-height: 1.8; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                💡 <strong>Pour répondre</strong> à ce message, cliquez simplement sur "Répondre" dans votre client email, ou écrivez directement à: <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: bold;">${email}</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 13px;">
              Message reçu via <strong>mcguyane.com</strong> • ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    console.log("✅ Email envoyé avec succès à preneuscliford@gmail.com");
    console.log("📧 ID de l'email:", data?.id);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Message envoyé avec succès",
        emailId: data?.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
