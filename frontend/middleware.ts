import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value;
    const profileCompleted = request.cookies.get('profile_completed')?.value === 'true';

    // If not authenticated and not on landing page → redirect to login
    if (!token && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated:
    if (token) {
        // If profile is NOT completed and they are not on onboarding → redirect to onboarding
        if (!profileCompleted && !pathname.startsWith('/onboarding') && pathname !== '/') {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        // If profile IS completed and they are on onboarding → redirect to dashboard
        if (profileCompleted && pathname.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Apply middleware to all routes except static files and API
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
