import type guineabotClient from "../../../musicClient";

export const name: string = "guildCreate";
export const execute = (client: guineabotClient, data: any) => {
    client.log({
        level: "info",
        content: `Left guild "${data.name}" (${data.id})`,
    });
};