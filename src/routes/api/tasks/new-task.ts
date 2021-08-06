import { Task } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { NewTaskAttributes } from 'src/global';

export const post: RequestHandler = async (request) => {
	const {
		answerType,
		difficulty,
		file,
		rightAnswer,
		typeId
	} = request.body.valueOf() as NewTaskAttributes;

	try {
		const newTask = await Task.create({
			answerType: answerType,
			difficulty: difficulty,
			imageString: file,
			rightAnswer: rightAnswer
		});

		await newTask.setType(typeId);

		return {
			status: 200,
			body: {
				message: 'Task successfully added'
			}
		};
	} catch (error) {
		console.error(error.message);
		return {
			status: 400,
			body: {
				message: error.message
			}
		};
	}
};
