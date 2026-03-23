import * as nodemailer from "https://esm.sh/nodemailer@6.9.8";

const allowedOrigins = [
  "https://fastesthre.com",
  "http://localhost:8080"
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin");
  const allowedOrigin = allowedOrigins.includes(origin as string) ? origin : "https://fastesthre.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin as string,
    "Access-Control-Allow-Headers": 'authorization, x-client-info, apikey, content-type',
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  console.log("Incoming request:", req.method);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      smtp_host, 
      smtp_port, 
      smtp_user, 
      smtp_pass, 
      smtp_from_email, 
      smtp_from_name, 
      test_email 
    } = await req.json();

    console.log(`Testing SMTP for: ${smtp_user} @ ${smtp_host}`);

    if (!smtp_host || !smtp_user || !smtp_pass || !test_email) {
      throw new Error('Missing required SMTP fields or test email address');
    }

    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port),
      secure: parseInt(smtp_port) === 465, 
      auth: {
        user: smtp_user,
        pass: smtp_pass,
      },
    });

    // Verify connection first
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${smtp_from_name || 'System Test'}" <${smtp_from_email || smtp_user}>`,
      to: test_email,
      subject: "FastestHR: SMTP Connection Test",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #3b82f6;">Connection Successful!</h2>
          <p>This is a test email from your <strong>FastestHR</strong> instance.</p>
          <p>Your SMTP settings correctly configured and verified at ${new Date().toLocaleString()}.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Configuration Details:</p>
          <ul style="font-size: 12px; color: #666;">
            <li>Host: ${smtp_host}</li>
            <li>Port: ${smtp_port}</li>
            <li>User: ${smtp_user}</li>
          </ul>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('SMTP Test Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
