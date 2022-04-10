import type guineabotClient from "../../../musicClient";

export const name: string = "warn";
export const execute = (client: guineabotClient, data: any) => {
    client.log({
        level: "warn",
        content: data,
    });
};