import type guineabotClient from "../../../musicClient";

export const name = "warn";
export const execute = (client: guineabotClient, data: string) => {
    client.log({
        level: "warn",
        content: data,
    });
};