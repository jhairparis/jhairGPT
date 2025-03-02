const isProduction = process.env.NODE_ENV === 'production';

export const CSRF_COOKIE = isProduction 
	? "__Secure-next-auth.callback-url" 
	: "next-auth.callback-url";

export const AUTH_COOKIE = isProduction 
	? "__Secure-next-auth.session-token" 
	: "next-auth.session-token";