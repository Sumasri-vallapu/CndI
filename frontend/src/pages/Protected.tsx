import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = () => {
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/protected/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setMsg(res.data.message))
            .catch(() => alert('Access denied or token expired'));
    }, []);

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)' }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Protected Page</h2>
                <p className="mt-2 text-gray-600">{msg}</p>
            </div>
        </div>
    );
};

export default Protected;
