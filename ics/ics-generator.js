import ical from 'ical-generator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import Yargs from "yargs";

const args = Yargs(process.argv.slice(2)).argv;

if (!args.group) {
    throw new Error("Please specify a group");
}

async function main() {
    const cal = ical({
        timezone: 'Europe/Paris',
        url: '',
    });

    const files = await fs.promises.readdir(path.join(__dirname, `../cached/${args.group}`));

    await Promise.all(files.map(async (file) => {
        const { default: events } = await import(`../cached/${args.group}/${file}`, {
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
    fs.writeFileSync(path.join(__dirname, `./${args.group.toLowerCase()}.ics`), cal.toString());
});