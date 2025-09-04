// app/api/contact/route.ts
import { NextResponse } from 'next/server';

// SendGrid configuration type
type SendGridMail = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, projectInterest } = body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurunuz.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // Get SendGrid API key from environment variables
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    
    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key is not configured');
      return NextResponse.json(
        { error: 'E-posta servisi yapılandırılmamış.' },
        { status: 500 }
      );
    }

    // Format the email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>CTS Website İletişim Formu</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #191970, #4169E1); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #191970; }
            .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>CTS Website İletişim Formu</h2>
              <p style="margin: 0;">Yeni bir iletişim formu gönderildi</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Ad Soyad:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">E-posta:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Telefon:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              
              ${projectInterest ? `
              <div class="field">
                <div class="label">İlgilendiği Proje:</div>
                <div class="value">${projectInterest}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Konu:</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">Mesaj:</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div class="footer">
                <p>Bu mesaj ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })} tarihinde gönderildi.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
CTS Website İletişim Formu

Ad Soyad: ${name}
E-posta: ${email}
Telefon: ${phone}
${projectInterest ? `İlgilendiği Proje: ${projectInterest}\n` : ''}
Konu: ${subject}

Mesaj:
${message}

Gönderim Tarihi: ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}
    `;

    // Prepare SendGrid mail object
    const mail: SendGridMail = {
      to: 'office@ctscyprushomes.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ctscyprushomes.com', // You need to set this verified sender email
      subject: `CTS Website İletişim Formu - ${subject}`,
      text: textContent,
      html: htmlContent,
    };

    // Send email using SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: mail.to }],
          },
        ],
        from: { 
          email: mail.from,
          name: 'CTS Cyprus Homes'
        },
        reply_to: {
          email: email,
          name: name
        },
        subject: mail.subject,
        content: [
          {
            type: 'text/plain',
            value: mail.text,
          },
          {
            type: 'text/html',
            value: mail.html,
          },
        ],
      }),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: 'E-posta başarıyla gönderildi.' },
        { status: 200 }
      );
    } else {
      const errorData = await response.text();
      console.error('SendGrid error:', errorData);
      return NextResponse.json(
        { error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}