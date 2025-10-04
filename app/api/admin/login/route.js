import { NextResponse } from 'next/server'
import { createAuthToken } from '@/lib/auth'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

function checkRateLimit(ip) {
  const now = Date.now()
  const userAttempts = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }
  
  if (now > userAttempts.resetTime) {
    userAttempts.count = 0
    userAttempts.resetTime = now + RATE_LIMIT_WINDOW
  }
  
  if (userAttempts.count >= MAX_ATTEMPTS) {
    return false
  }
  
  userAttempts.count++
  rateLimitMap.set(ip, userAttempts)
  return true
}

async function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    console.error('Admin credentials not configured')
    return false
  }

  return username === expectedUsername && password === expectedPassword
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password required' },
        { status: 400 }
      )
    }
    
    const isValid = await verifyCredentials(username, password)
    
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Create token and set cookie on response
    const token = await createAuthToken(username)
    const response = NextResponse.json({ 
      message: 'Login successful',
      success: true 
    })
    
    // Set the cookie on the response object
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}