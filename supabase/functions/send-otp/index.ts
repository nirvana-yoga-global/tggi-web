import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase
      .from('otp_verifications')
      .insert({ email, otp, expires_at: expiresAt, is_used: false })

    if (insertError) throw insertError

    const brevoApiKey = Deno.env.get('BREVO_API_KEY') ?? ''

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Nirvana Yoga Global', email: 'info@nirvanayogaglobal.com' },
        to: [{ email }],
        subject: 'Your TGGI Verification Code — Jai Madhav ji',
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #faf7f0; color: #1f3d2b;">
            <h2 style="margin: 0 0 8px; font-size: 22px;">Jai Madhav ji</h2>
            <p style="margin: 0 0 24px; color: #444;">Your verification code for the TGGI plant registration:</p>
            <div style="background: #fff; border: 2px solid #1f3d2b; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #1f3d2b;">${otp}</span>
            </div>
            <p style="margin: 0; color: #666; font-size: 14px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
            <p style="margin: 0; color: #999; font-size: 12px;">Nirvana Yoga Global Ashram &middot; Trivandrum, Kerala</p>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errBody = await emailResponse.text()
      throw new Error(`Brevo error: ${errBody}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
