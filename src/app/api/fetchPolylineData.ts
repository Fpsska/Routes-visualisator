interface propTypes {
    lng_start: number;
    lat_start: number;
    lng_end: number;
    lat_end: number;
}

// /. interfaces

export async function fetchPolylineData(props: propTypes): Promise<any> {
    const { lng_start, lat_start, lng_end, lat_end } = props;

    try {
        const URL = `http://router.project-osrm.org/route/v1/driving/${lng_start},${lat_start};${lng_end},${lat_end}?overview=full`;
        // const URL =
        //     'http://router.project-osrm.org/route/v1/driving/30.29496392,59.84660399;30.42423701,59.82934196?overview=full';

        const response = await fetch(URL);

        if (!response.ok) {
            return new Error('some error with response');
        }

        return await response.json();
    } catch (err: any) {
        console.error(err.message);
    }
}
