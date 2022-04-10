import type guineabotClient from "../../../musicClient";

export const name: string = "raw";
export const execute = (client: guineabotClient, data: any) => {
    client.manager.updateVoiceState(data);
};