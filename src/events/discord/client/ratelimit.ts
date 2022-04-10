import type guineabotClient from "../../../musicClient";

export const name = "ratelimit";
export const execute = (client: guineabotClient, data: string) => {
    client.log({
        level: "warn",
        content: `Ratelimit exceeded: ${data}`,
    });
};