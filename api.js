import axios from 'axios';
import { JSDOM } from 'jsdom';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

import dotenv from 'dotenv';

dotenv.config();

export async function fetchHTML() {
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

        return dataPageResponse.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
