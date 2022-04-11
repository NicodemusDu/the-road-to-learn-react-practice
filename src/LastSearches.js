import React from 'react';
const LastSearches = ({ lastSearches, onLastSearch }) => (
    <div>
        {lastSearches.map((value, index) => (
            <button
                key={value + index}
                type="button"
                onClick={() => onLastSearch(value)}
            >
                {value}
            </button>
        ))}
    </div>
);

export default LastSearches;
