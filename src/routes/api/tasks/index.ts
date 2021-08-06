import { Task, Type } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { EditFieldAttributes } from 'src/global';

export const get: RequestHandler = async (request) => {
	const tasks = await Task.findAll({ include: Type });
	const tempTasks = tasks.map((task) => {
		return { ...task.get() };
	});
	return {
		status: 200,
		body: {
			tasks: tempTasks
		}
	};
};

export const put: RequestHandler = async (request) => {
	// console.log(request.body);
	const {
		editAnswerType,
		editDifficulty,
		editFile,
		editRightAnswer,
		editTypeId,
		editTask
	} = request.body.valueOf() as EditFieldAttributes;

	// console.log(editTask);

	// KÖR FINDBYPK ISTÄLLET, SEN UPPDATERA DEN SEN UPPDATERA TYPE FÖR TASKEN

	try {
		const task = await Task.findByPk(editTask.id);

		const updatedTask = await task.update({
			answerType: editAnswerType,
			difficulty: editDifficulty,
			imageString: editFile,
			rightAnswer: editRightAnswer
		})

		await updatedTask.setType(editTypeId);
	} catch (error) {
		console.error(error);
		return {
			status: 400,
			body: {
				message: 'Something went wrong',
			}
		}
	}

	return {
		status: 200,
		body: {
			message: 'Task edited'
		}
	}





	// Task.update(
	// 	{

	// 	},
	// 	{ where: { id: editTask.id } }
	// )
	// 	.then((task) => {
	// 		console.log('first task', task)
	// 		const tasks = task[1];

	// 		console.log('second task', tasks[0])
	// 		tasks[0].setType(editTypeId);

	// 		return {
	// 			status: 200,
	// 			body: {
	// 				message: 'Task edited'
	// 			}
	// 		};
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 		return {
	// 			status: 400,
	// 			body: {
	// 				message: 'Something went wrong'
	// 			}
	// 		};
	// 	});
};
