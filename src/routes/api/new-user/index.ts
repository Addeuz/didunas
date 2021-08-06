import { School, User, UserAttributes } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { RegisterAttributes } from 'src/global';

export const post: RequestHandler = async (request) => {
	const {
		username,
		password,
		type,
		email,
		fullName,
		age,
		schoolId
	} = request.body.valueOf() as RegisterAttributes;

	const user = await User.findOne({ where: { username } });

	if (user) {
		return {
			status: 401,
			body: {
				message: 'User already exists'
			}
		};
	}

	const newUser = await User.create({
		username,
		password,
		type,
		email,
		fullname: fullName,
		age
	}).catch((err) => {
		console.error(err);
		return {
			status: 400,
			body: {
				message: 'Something went wrong',
				error: err
			}
		};
	}) as User;

	await newUser.addSchool(await School.findByPk(schoolId))

	return {
		status: 200,
		body: {
			message: 'User created successfully'
		}
	};
};

export const get: RequestHandler = async (request) => {

	if (request.locals.user) {
		const user = request.locals.user as UserAttributes;
		if (user.type === 'researcher') {
			const schools = await School.findAll();
			const tempSchools = schools.map((school) => {
				return { ...school.get() };
			});

			return {
				status: 200,
				body: {
					schools: tempSchools
				}
			};
		}
	}

	return {
		status: 204,
		body: {
			message: 'Not a researcher'
		}
	};
};
