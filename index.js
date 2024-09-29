import { parseHTML } from './htmlParser/htmlParser.js';
import { fetchHTML } from './api/api.js';
import { parseDate, getFirstDayOfWeek } from './utils/utils.js';
import Yargs from "yargs";
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const args = Yargs(process.argv.slice(2)).argv;
let date = new Date();
if (args.date) {
    date = parseDate(args.date)
} else if (args.week) {
    date = getFirstDayOfWeek(args.year ?? date.getFullYear(), args.week);
}

let credentials =  {
    username: process.env.USERNAME_EPSI,
    password: process.env.PASSWORD_EPSI
}

if (args.username && args.password) {
    credentials = {
        username: args.username,
        password: args.password
    }
}

async function main() {
    const html = await fetchHTML(date, credentials);
    const parsedObject =await parseHTML(html)
    const jsonString = JSON.stringify(parsedObject, null, 2);

    if (args.output) {
        fs.writeFile(args.output, jsonString, err => {
            if (err) {
                console.error(err);
            }
        });
    }

    console.log(jsonString);
}

main();
