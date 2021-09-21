import { Type } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async (request) => {
    const { params } = request;

    console.log("params:");
    console.log(params.type);

    const taskType = await Type.findOne({where: { name: params.type }});
    const tasks = await taskType.getTasks();
    console.log(taskType);

    // const tasks = await Task.findAll({ where: { Type: taskType.id } });

    const tempTasks = tasks.map((task) => {
		return { ...task.get() };
	});

    console.log(tasks);


    return {
        body: {
            tasks: [...tempTasks],
        }
    }
}