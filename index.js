import { parseHTML } from './htmlParser.js';
import { fetchHTML } from './api.js';
import { parseDate } from './utils.js';
import Yargs from "yargs";
import dotenv from 'dotenv';

dotenv.config();

const args = Yargs(process.argv.slice(2)).argv;

const date = args.date ? parseDate(args.date) : new Date();

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
    console.log(await parseHTML(html));
}

main();
