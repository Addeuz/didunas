import { Cookie, School, User } from '$lib/database';
import * as cookie from 'cookie';
import type { Handle, GetSession } from '@sveltejs/kit';

// export async function getContext({ headers }): Promise<{ authenticated: boolean; user?: undefined; } | { authenticated: boolean; user: User; }> {
// 	const cookies = cookie.parse(headers.cookie || '');

// 	if (!cookies.session_id) {
// 		return {
// 			authenticated: false
// 		};
// 	}

// 	const user = Cookie.findOne({ where: { cookieId: cookies.session_id } }).then((cookie) => {
//         return cookie.getUser();
//     }).then(user => {
//         return user
//     });

//     console.log(await user);

//     if (user) {
//         return {
//             authenticated: true,
//             user: await user
//         }
//     } else {
//         return {
//             authenticated: false,
//         }
//     }

// }

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');

	if (cookies.session_id) {
		const userCookie = await Cookie.findOne({ where: { cookieId: cookies.session_id } });
		const user = await (await userCookie.getUser({ include: School })).toJSON();
		request.locals.user = { ...user };
		request.locals.authenticated = true;
	} else {
		request.locals.authenticated = false;
	}

	return await resolve(request);
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = ({ locals }) => {
	if (!locals.authenticated) {
		return {
			authenticated: locals.authenticated
		};
	}

	return {
		authenticated: locals.authenticated,
		user: locals.user
	};
};
