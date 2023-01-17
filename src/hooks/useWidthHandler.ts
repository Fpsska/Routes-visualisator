import { useState, useEffect } from 'react';

// /. imports

export function useWidthHandler(breakpoint: number): {
    isAllowableRes: boolean;
} {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [isAllowableRes, setAllowableRes] = useState<boolean>(false);

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        setAllowableRes(width > breakpoint);
    }, [width, breakpoint]);

    return { isAllowableRes };
}
