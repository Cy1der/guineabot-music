import type guineabotClient from "../../../musicClient";

export const name: string = "debug";
export const execute = (client: guineabotClient, data: any) => {
    client.log({
        level: "info",
        content: JSON.stringify(data),
    });
};