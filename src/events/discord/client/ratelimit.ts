import type guineabotClient from "../../../musicClient";

export const name: string = "ratelimit";
export const execute = (client: guineabotClient, data: any) => {
    client.log({
        level: "warn",
        content: `Ratelimit exceeded: ${JSON.stringify(data, null, 4)}`,
    });
};