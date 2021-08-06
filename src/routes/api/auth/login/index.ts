import { Cookie, User } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { LoginAttributes } from 'src/global';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as cookie from 'cookie';

export const post: RequestHandler = async (request) => {
	// const { username, password, type } = request.body;
	const { username, password } = request.body.valueOf() as LoginAttributes;

	const user = await User.findOne({ where: { username } });

	if (!user) {
		return {
			status: 401,
			body: {
				message: 'Incorrect username or password'
			}
		};
	}

	if (!bcrypt.compareSync(password, user.password)) {
		return {
			status: 401,
			body: {
				message: 'Incorrect username or password'
			}
		};
	}

	const cookieId = uuidv4();
    Cookie.create({
        cookieId,
    }).then(cookie => {
        cookie.setUser(user);
    })

	const headers = {
		'Set-Cookie': cookie.serialize('session_id', cookieId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			sameSite: 'lax',
			path: '/'
		})
	};

	return {
		status: 200,
		headers,
		body: {
			message: 'Success'
		}
	};
};
