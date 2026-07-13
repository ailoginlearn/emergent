import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { getCol } from './mongo'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-dev'
export const COOKIE_NAME = 'admin_token'

export async function hashPassword(pw) {
  return bcrypt.hash(pw, 10)
}

export async function comparePassword(pw, hash) {
  return bcrypt.compare(pw, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function setAuthCookie(token) {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookie() {
  const store = await cookies()
  store.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
}

export async function getAuthUser() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload?.id) return null
  const users = await getCol('users')
  const user = await users.findOne({ _id: payload.id })
  if (!user) return null
  const { passwordHash, ...safe } = user
  return safe
}

export async function ensureSeedAdmin() {
  const users = await getCol('users')
  const count = await users.countDocuments()
  if (count > 0) return
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase()
  const pw = process.env.ADMIN_INITIAL_PASSWORD
  if (!email || !pw) return
  const passwordHash = await hashPassword(pw)
  await users.insertOne({
    _id: crypto.randomUUID(),
    email,
    passwordHash,
    role: 'admin',
    name: 'Admin',
    createdAt: new Date(),
  })
}

export function requireAuth(user) {
  if (!user) {
    return { ok: false, res: { error: 'Unauthorized' }, status: 401 }
  }
  return { ok: true }
}
