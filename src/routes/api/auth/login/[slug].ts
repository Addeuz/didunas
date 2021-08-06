import { User } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler<FormData> = async (request) => {


    const { slug } = request.params;

    const user = await User.findOne({ where: { username: slug } });
    if (!user) {
        return {
            status: 401,
            body: {
                message: 'User not found'
            }
        }
    }

    const newClass = await user.getSchools();


    return {
        status: 200,
        body: {
            class: {...newClass[0].get()},
            user: {...user.get()},
        }
    }
}