import { NextResponse } from 'next/server'
import { ensureSeedAdmin, comparePassword, signToken, setAuthCookie } from '@/lib/auth'
import { getCol } from '@/lib/mongo'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    await ensureSeedAdmin()
    const users = await getCol('users')
    const user = await users.findOne({ email: String(email).toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const ok = await comparePassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = signToken({ id: user._id, email: user.email, role: user.role })
    await setAuthCookie(token)
    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
