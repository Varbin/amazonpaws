import { NextRequest, NextResponse } from 'next/server'
import {isLoggedIn, updateSession} from '@/lib/session'

export default async function middleware(req: NextRequest) {
    if (!await isLoggedIn()) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    await updateSession();
    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/edit/:path', '/edit'],
}