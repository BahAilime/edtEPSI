import { parseHTML } from './htmlParser.js';
import { fetchHTML } from './api.js';

async function main() {
    // const html = await fetchHTML(week, credentials);
    const html = await fetchHTML();
    console.log(await parseHTML(html));
}

main();
