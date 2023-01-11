export async function fetchRequestsData(): Promise<any> {
    try {
        const URL = 'https://my-json-server.typicode.com/Fpsska/mockjson/ilsDB';

        const response = await fetch(URL);

        if (!response.ok) {
            return new Error('some error with response');
        }

        return await response.json();
    } catch (err: any) {
        console.error(err.message);
    }
}
