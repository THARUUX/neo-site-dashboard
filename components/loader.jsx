import React from 'react';

export default function Loader({ handle }) {
    if (handle) {
        return (
            <div className='fixed h-screen w-screen flex justify-center items-center bg-white/50'>
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}

