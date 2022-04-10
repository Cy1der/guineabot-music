import type guineabotClient from "../../../musicClient";

export const name: string = "nodeConnect";
export const execute = (client: guineabotClient, node: any) => {
    client.log({
        level: "info",
        content: `${node.options.identifier} connected to Lavalink`,
    });
};