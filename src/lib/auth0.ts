import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0Audience = process.env.AUTH0_AUDIENCE?.trim() || undefined;

export const auth0 = new Auth0Client({
	authorizationParameters: auth0Audience
		? {
				audience: auth0Audience,
				scope: 'openid profile email',
			}
		: {
				scope: 'openid profile email',
			},
});