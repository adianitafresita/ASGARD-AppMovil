import * as constantes from '../utils/constantes';

const fetchData = async (filename, action, form = null) => {
    const OPTIONS = {};
    if (form) {
        OPTIONS.method = 'POST';
        OPTIONS.body = form;
    } else {
        OPTIONS.method = 'GET'; 
    }
    try {
        const PATH = new URL(`${constantes.IP}/services/admin/${filename}.php`);
        PATH.searchParams.append('action', action);

        console.log(`Fetching data from: ${PATH.href}`); // Mensaje de depuración

        const RESPONSE = await fetch(PATH.href, OPTIONS);
        const TEXT = await RESPONSE.text();

        console.log(`Response status: ${RESPONSE.status}`);
        console.log(`Response text: ${TEXT}`); // Mensaje de depuración
        
        if (!RESPONSE.ok) {
            throw new Error(`HTTP error! status: ${RESPONSE.status}, message: ${TEXT}`);
        }

        try {
            return JSON.parse(TEXT);
        } catch (jsonError) {
            throw new Error(`JSON Parse error: ${jsonError.message}, response: ${TEXT}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return { error: true, message: error.message };
    }
};


export default fetchData;