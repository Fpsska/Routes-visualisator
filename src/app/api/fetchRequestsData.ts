export async function fetchRequestsData(): Promise<any> {
    try {
        const URL = 'https://my-json-server.typicode.com/Fpsska/mockjson/ilsDB';

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error('some error with response of my-json-server');
        }

        return await response.json();
    } catch (err: any) {
        console.error('Error of my-json-server:', err.message);
    }
}
