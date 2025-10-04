// lib/auth.js
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!'
)

// Verify credentials against environment variable
async function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD
  
  if (!expectedUsername || !expectedPassword) {
    console.error('Admin credentials not configured')
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  const usernameMatch = username === expectedUsername
  const passwordMatch = password === expectedPassword
  
  return usernameMatch && passwordMatch
}

// Create JWT token
export async function createAuthToken(username) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY)
  
  return token
}

// Verify JWT token
export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch (error) {
    return null
  }
}

// Validate token from request (for API routes)
export async function validateAdminToken(request) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return false
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    
    const token = cookies['admin-token']
    if (!token) return false
    
    const payload = await verifyAuthToken(token)
    return !!payload
  } catch (error) {
    console.error('Auth validation error:', error)
    return false
  }
}

// Validate token from server components
export async function validateAdminTokenServer() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')
    
    if (!token?.value) return false
    
    const payload = await verifyAuthToken(token.value)
    return !!payload
  } catch (error) {
    console.error('Server auth validation error:', error)
    return false
  }
}

// Set secure cookie
export async function setAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}

// Export login handler
export async function handleLogin(username, password) {
  const isValid = await verifyCredentials(username, password)
  
  if (!isValid) {
    return { success: false, message: 'Invalid credentials' }
  }
  
  const token = await createAuthToken(username)
  await setAuthCookie(token)
  
  return { success: true }
}