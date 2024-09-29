import ical from 'ical-generator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    const cal = ical({
        timezone: 'Europe/Paris',
        url: 'https://example.com',
    });

    const files = await fs.promises.readdir(path.join(__dirname, "../cached/B3DEVIA"));

    await Promise.all(files.map(async (file) => {
        const { default: events } = await import(`../cached/B3DEVIA/${file}`, {
            with: {
                type: "json",
            }
        })

        events.forEach(event => {
            event.instructor = event.instructor ? `🧑‍🏫<b>Intervenant:</b> ${event.instructor}` : ""
            const middle = event.instructor && event.group ? "<br>" : ""
            event.group = event.group ? `🧑‍💻<b>Groupe:</b> ${event.group}` : ""
            const description = `${event.instructor}${middle}${event.group}`
            console.log("cool event c:", event.title);

            cal.createEvent(
                {
                    summary: event.title,
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    description: description
                }
            );
        });
    }));
    
    return cal;
};

main().then((cal) => {
    console.log(cal.toString());
});