import type { RequestHandler } from "@sveltejs/kit";
import { Cookie, User } from "$lib/database";
import * as cookie from 'cookie'

export const post: RequestHandler = async (request) => {
    const cookies = cookie.parse(request.headers.cookie || '');

    if (cookies.session_id && request.locals.user) {
        const deleteCookie = await Cookie.destroy({ where: { cookieId: cookies.session_id,  } });
    }

    const headers = {
        'Set-Cookie': cookie.serialize('session_id', cookies.session_id, {
			httpOnly: true,
            expires: new Date(0),
			sameSite: 'lax',
			path: '/'
		})
    }

    return {
        status: 200,
        headers,
        body: {
            message: 'Logout successful',
        }
    }
}