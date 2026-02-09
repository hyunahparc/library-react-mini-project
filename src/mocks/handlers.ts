import { http, delay, HttpResponse } from 'msw';
import mockBookDetail from './fixtures/mockBookDetail.json';

export const handlers = {

    // BookDetailPage mock
    getMock200: http.get('https://openlibrary.org/works/:id.json', async() => {
        await delay(2000);
        return HttpResponse.json(mockBookDetail);  
    }),
    getMock500: http.get(`https://openlibrary.org/works/:id.json`, async () => {
        await delay(2000);
        return HttpResponse.json({ error: "message d'erreur" }, { status: 500 });
    }),


};
