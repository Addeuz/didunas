import type { ReadOnlyFormData } from "@sveltejs/kit/types/helper";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

export const server = 'http://localhost:3000';


// export function getFormBody(body: ServerRequest<ReadOnlyFormData, unknown>): Record<string, unknown> {
//     return [...body.entries()].reduce((data, [k, v]) => {
//       let value = v;
//       if (value === 'true') value = true;
//       if (value === 'false') value = false;
//       if (k in data)
//         data[k] = Array.isArray(data[k]) ? [...data[k], value] : [data[k], value];
//       else data[k] = value;
//       return data;
//     }, {});
//   }

export const toBase64 = (file: File): Promise<string> => {
    return new Promise<string> ((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.toString());
        reader.onerror = error => reject(error);
    })
}