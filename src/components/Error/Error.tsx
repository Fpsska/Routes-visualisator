import React, { useState, useEffect } from 'react';

// /. imports

interface propTypes {
    message: string;
    delay?: number;
}

// /. interfaces

const Error: React.FC<propTypes> = ({ message, delay }) => {
    const [isVisible, setVisibleStatus] = useState<boolean>(false);

    // /. hooks

    useEffect(() => {
        if (!delay) {
            setVisibleStatus(true);
        }

        const timer = setTimeout(() => {
            setVisibleStatus(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    // /. effects

    return (
        <span
            style={{
                color: 'red',
                textAlign: 'center',
                width: '100%',
                padding: isVisible ? '10px' : 0,
                transition: 'all .35s ease-in-out'
            }}
        >
            {isVisible && message}
        </span>
    );
};

export default Error;
