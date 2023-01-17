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
        const URL = `https://router.project-osrm.org/route/v1/driving/${lng_start},${lat_start};${lng_end},${lat_end}`;

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error('some error with response of osrm.org ');
        }

        return await response.json();
    } catch (err: any) {
        throw new Error(err.message);
    }
}
