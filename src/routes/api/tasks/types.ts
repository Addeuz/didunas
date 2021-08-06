import { Type } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async (request) => {
    const types = await Type.findAll();
    const tempTypes = types.map(type => {
        return {...type.get()}
    })
	return {
        status: 200,
        body: {
            types: tempTypes
        }
    }
};