const axios = require('axios');
const { JSDOM } = require('jsdom');
const qs = require('qs');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

require('dotenv').config();

/*
# .env template 
USERNAME_EPSI=prenom.nom
PASSWORD_EPSI=XXXX
*/

async function fetchHTML() {
    try {
        const loginPageResponse = await client.get('https://cas-p.wigorservices.net/cas/login', {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const dom = new JSDOM(loginPageResponse.data);
        const document = dom.window.document;

        const executionField = document.querySelector('input[name=execution]');
        const ltField = document.querySelector('input[name=lt]');

        const execution = executionField ? executionField.value : null;
        const lt = ltField ? ltField.value : null;

        const formData = {
            username: process.env.USERNAME_EPSI,
            password: process.env.PASSWORD_EPSI,
            _eventId: 'submit'
        };

        if (execution) formData.execution = execution;
        if (lt) formData.lt = lt;

        const loginResponse = await client.post(
            'https://cas-p.wigorservices.net/cas/login',
            qs.stringify(formData),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0',
                }
            }
        );

        const dataPageResponse = await client.get(`https://ws-edt-cd.wigorservices.net/WebPsDyn.aspx?action=posEDTLMS&serverID=C&Tel=${process.env.USERNAME_EPSI}&date=09%2F30%2F2024`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        const domDataPage = new JSDOM(dataPageResponse.data);
        
        const documentDataPage = domDataPage.window.document;
        
        const allCase = documentDataPage.querySelectorAll('.Case');
        let dates = documentDataPage.querySelectorAll('.TCJour');
        dates = Array.from(dates).map(event => event.textContent).slice(5, 10);

        const leftToDayMap = {
            '103': dates[0],
            '122': dates[1],
            '141': dates[2],
            '161': dates[3],
            '180': dates[4],
        };

        const jsonCase = Array.from(allCase).map((event) => {
            const tdTCase = event.querySelector('td.TCase');
            let title = '';

            if (tdTCase) {
                const childNodes = Array.from(tdTCase.childNodes);
                title = childNodes.find(node => node.nodeType === 3)?.textContent.trim() || '';  // Extract text node content
            }
            const group = event.querySelector('td.TCProf')?.textContent.trim();  // EX "BACHELOR 3 DEVIA DS ALT 24/25 EPSI NTE"
            const time = event.querySelector('td.TChdeb')?.textContent.trim();  // EX "09:00 - 12:00"
            const location = event.querySelector('td.TCSalle')?.textContent.trim();  // EX "Salle:N211(HEP Nantes)"

            const styleAttr = event.attributes['style'];
            const match = styleAttr && styleAttr.value.match(/left:(\d+)/);
            const leftValue = match && match[1].substring(0, 3);
            const day = leftToDayMap[leftValue] || null;

            return {
                title: title || '',
                group: group || '',
                day: day || '',
                time: time || '',
                location: location || ''
            };

        }).filter(event => event.title !== "");

        return jsonCase;
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchHTML().then(jsonCase => {
    console.log(jsonCase);
}).catch(err => {
    console.error('Error:', err);
});
