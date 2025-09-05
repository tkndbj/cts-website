// app/api/contact/route.ts
import { NextResponse } from 'next/server';

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

    // Check for required environment variables
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
    
    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not configured');
      return NextResponse.json(
        { error: 'E-posta servisi yapılandırılmamış. (API Key missing)' },
        { status: 500 }
      );
    }

    if (!SENDGRID_FROM_EMAIL) {
      console.error('SENDGRID_FROM_EMAIL is not configured');
      return NextResponse.json(
        { error: 'E-posta servisi yapılandırılmamış. (From email missing)' },
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

    // Log the attempt (for debugging)
    console.log('Attempting to send email to:', 'office@ctscyprushomes.com');
    console.log('From email:', SENDGRID_FROM_EMAIL);

    // Send email using SendGrid API
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'office@ctscyprushomes.com' }],
          },
        ],
        from: { 
          email: SENDGRID_FROM_EMAIL,
          name: 'CTS Cyprus Homes'
        },
        reply_to: {
          email: email,
          name: name
        },
        subject: `CTS Website İletişim Formu - ${subject}`,
        content: [
          {
            type: 'text/plain',
            value: textContent,
          },
          {
            type: 'text/html',
            value: htmlContent,
          },
        ],
      }),
    });

    // Check response
    if (sendGridResponse.ok || sendGridResponse.status === 202) {
      console.log('Email sent successfully');
      return NextResponse.json(
        { message: 'Mesajınız başarıyla gönderildi!' },
        { status: 200 }
      );
    } else {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid error response:', {
        status: sendGridResponse.status,
        statusText: sendGridResponse.statusText,
        error: errorText
      });
      
      // Parse error if possible
      let errorMessage = 'E-posta gönderilemedi.';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message || errorMessage;
        }
      } catch (e) {
        // Couldn't parse error, use default message
      }

      return NextResponse.json(
        { error: `${errorMessage} Lütfen daha sonra tekrar deneyin.` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}