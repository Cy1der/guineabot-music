import type guineabotClient from "../../../musicClient";

export const name = "debug";
export const execute = (client: guineabotClient, data: string) => {
    console.log(typeof data)
    client.log({
        level: "info",
        content: data,
    });
};