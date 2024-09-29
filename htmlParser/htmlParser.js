import { JSDOM } from 'jsdom';

function convertDate(dateString) {
    const months = {
        "Janvier": "01",
        "Février": "02",
        "Mars": "03",
        "Avril": "04",
        "Mai": "05",
        "Juin": "06",
        "Juillet": "07",
        "Août": "08",
        "Septembre": "09",
        "Octobre": "10",
        "Novembre": "11",
        "Décembre": "12"
    };

    let dateParts = dateString.split(" ");
    let day = dateParts[1];         // Get the day
    let month = dateParts[2];       // Get the month

    let monthNumber = months[month];

    return `${day}/${monthNumber}`;
}

function extractLocation(locationString) {
    if (!locationString) {
        return "";
    }

    let distancielMatch = locationString.match(/Salle:SALLE_(\d+)\((DISTANCIEL)\)/i);
    let physicalRoomMatch = locationString.match(/Salle:N(\d+)\((HEP Nantes)\)/i);

    if (distancielMatch) {
        let roomNumber = distancielMatch[1];
        let locationType = distancielMatch[2];
        return `${locationType.charAt(0).toUpperCase() + locationType.slice(1).toLowerCase()} ${roomNumber}`;
    }

    if (physicalRoomMatch) {
        let roomNumber = physicalRoomMatch[1];
        return `${roomNumber}`;
    }

    return null;
}

function capitalizeName(name) {
    return name.split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
}

export async function parseHTML(html) {
    try {
        const dataPageDocument = new JSDOM(html).window.document;

        if (html.search("Pas de cours cette semaine")) {
            return {
                error: "Pas de cours cette semaine"
            }
        }

        const caseElements = dataPageDocument.querySelectorAll('.Case');
        const dateElements = dataPageDocument.querySelectorAll('.TCJour');
        const dates = Array.from(dateElements).map(element => element.textContent).slice(5, 10);
        const leftToDayMap = {
            '103': dates[0],
            '122': dates[1],
            '141': dates[2],
            '161': dates[3],
            '180': dates[4],
        };

        const jsonCase = Array.from(caseElements).map((event) => {
            const tdTCase = event.querySelector('td.TCase');
            let title = '';

            if (tdTCase) {
                const childNodes = Array.from(tdTCase.childNodes);
                title = childNodes.find(node => node.nodeType === 3)?.textContent.trim() || '';  // Extract text node content
            }

            // Extract prof and group
            const groupHTML = event.querySelector('td.TCProf')
            let group = ["", ""];
            if (groupHTML) {
                let wordsToRemove = ["24/25", "EPSI", "NTE", "DEVIA", "BACHELOR", "3", "ALT"];
                let span = groupHTML.querySelector('span');
                if (span) span.remove();
                let text = groupHTML.innerHTML;
                group = text.split('<br>').map(text => text.trim());

                group[0] = capitalizeName(group[0].split(' ').reverse().join(' '));

                group[1] = group[1].split(' ')
                    .filter(word => !wordsToRemove.includes(word))
                    .join(' ');
            }

            let time = event.querySelector('td.TChdeb')?.textContent.trim().split(" - ");  // EX "09:00 - 12:00"
            if (time == undefined) {
                time = ["", ""]
            }

            let location = extractLocation(event.querySelector('td.TCSalle')?.textContent.trim());  // EX "Salle:N211(HEP Nantes)"         

            const styleAttr = event.attributes['style'];
            const match = styleAttr && styleAttr.value.match(/left:(\d+)/);
            const leftValue = match && match[1].substring(0, 3);
            let day = leftToDayMap[leftValue];
            if (day) {
                day = convertDate(day);
            }

            return {
                title: title || '',
                prof: group?.[0] || '',
                group: group?.[1] || '',
                day: day || '',
                start: time[0] || '',
                end: time[1] || '',
                location: location || ''
            };

        }).filter(event => event.title !== "");

        return jsonCase;
    } catch (error) {
        console.error('Error in parseHTML:', error);
    }
}
