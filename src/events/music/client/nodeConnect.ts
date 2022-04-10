import type guineabotClient from "../../../musicClient";

export const name = "nodeConnect";
export const execute = (client: guineabotClient, node: any) => {
    client.log({
        level: "info",
        content: `${node.options.identifier} connected to Lavalink`,
    });
};