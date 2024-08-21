import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TypeScript interface for props, though in this case, it's not needed since there are no props.
// interface CSRFTokenProps {}

const CSRFToken: React.FC = () => {
    // State to hold the CSRF token
    const [csrftoken, setcsrftoken] = useState<string>('');

    // Function to get a cookie by name
    const getCookie = (name: string): string | null => {
        let cookieValue: string | null = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === `${name}=`) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/user/csrf_cookie`);
            } catch (err) {
                console.error('Failed to fetch CSRF cookie:', err);
            }
        };

        fetchData();
        setcsrftoken(getCookie('csrftoken') || '');
    }, []);

    return (
        <input type='hidden' name='csrfmiddlewaretoken' value={csrftoken} />
    );
};

export default CSRFToken;
