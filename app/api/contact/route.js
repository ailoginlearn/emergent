import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'
import { getCol } from '@/lib/mongo'

const RECIPIENT = 'ailogin.learn@gmail.com'

const escapeHtml = (str = '') =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // 1. Persist to Mongo (so admin panel can list)
    try {
      const contacts = await getCol('contacts')
      await contacts.insertOne({
        _id: crypto.randomUUID(),
        name,
        email,
        subject,
        message,
        status: 'unread',
        starred: false,
        createdAt: new Date(),
      })
    } catch (dbErr) {
      console.error('Contact DB save failed:', dbErr)
    }

    // 2. Send email via Resend
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Email service is not configured.' },
        { status: 500 }
      )
    }
    const resend = new Resend(apiKey)

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f7f7fb;padding:24px;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;border:1px solid #eee;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111;">📬 New Portfolio Message</h2>
          <p style="margin:0 0 20px;color:#666;font-size:14px;">You just got a new inquiry from your website contact form.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#222;">
            <tr><td style="padding:8px 0;color:#888;width:110px;">From</td><td style="padding:8px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#6b21e8;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;">${escapeHtml(subject)}</td></tr>
          </table>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #eee;">
            <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
            <div style="white-space:pre-wrap;line-height:1.6;color:#111;">${escapeHtml(message)}</div>
          </div>
        </div>
        <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">Sent from your portfolio website.</p>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: `New Portfolio Message: ${subject}`,
      replyTo: email,
      html,
      text: `New message from ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to send email.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
