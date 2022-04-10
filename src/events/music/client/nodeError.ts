import type guineabotClient from "../../../musicClient";

export const name = "nodeConnect";
export const execute = (client: guineabotClient, node: any, error: any) => {
    client.log({
        level: "error",
        content: `${node.options.identifier} crashed: ${error.message}`,
    });
};