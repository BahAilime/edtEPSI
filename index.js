import { parseHTML } from './htmlParser.js';
import { fetchHTML } from './api.js';
import { parseDate } from './utils.js';
import Yargs from "yargs";
import dotenv from 'dotenv';

dotenv.config();

const args = Yargs(process.argv.slice(2)).argv;

const date = args.date ? parseDate(args.date) : new Date();

async function main() {
    const html = await fetchHTML(date, {
        username: process.env.USERNAME_EPSI,
        password: process.env.PASSWORD_EPSI
    });
    console.log(await parseHTML(html));
}

main();
