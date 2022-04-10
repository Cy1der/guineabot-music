import type guineabotClient from "../../../musicClient";

export const name: string = "error";
export const execute = (client: guineabotClient, data: any) => {
    client.log({
        level: "error",
        content: JSON.stringify(data),
    });
};