import type guineabotClient from "../../../musicClient";
import ms from "ms";
import type { PresenceData, ClientPresence } from "discord.js";

const exportData = {
    name: 'ready',
    execute: (client: guineabotClient) => {
        client.manager.init(client.user.id);
        client.log({
            level: "success",
            content: `Logged in as ${client.user.tag}`,
        });
        setPresence(client);
        setInterval(() => setPresence(client), ms('m'));
    }
}

export {exportData};

function setPresence(client: guineabotClient): ClientPresence {
    const servers = client.guilds.cache.size;
    const options: PresenceData = {
        status: "online",
        activities: [
            {
                name: `for commands in ${servers} servers`,
                type: "LISTENING",
            }
        ]
    };
    return client.user.setPresence(options);
}