import axios from 'axios';
import { JSDOM } from 'jsdom';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export async function fetchHTML(date, credentials) {
    if (!credentials || credentials.username === undefined || credentials.password === undefined) {
        throw new Error('Missing credentials');
    }

    if (!date || !Object.prototype.toString.call(date) === '[object Date]') {
        throw new Error('Missing date');
    }

    if (date.toString() === 'Invalid Date') {
        throw new Error('Invalid date');
    }

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
            username: credentials.username,
            password: credentials.password,
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

        const urlDate = encodeURIComponent((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
        const dataPageResponse = await client.get(`https://ws-edt-cd.wigorservices.net/WebPsDyn.aspx?action=posEDTLMS&serverID=C&Tel=${process.env.USERNAME_EPSI}&date=${urlDate}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        return dataPageResponse.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
