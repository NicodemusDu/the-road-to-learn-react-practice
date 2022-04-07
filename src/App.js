import React from 'react';
import ReactDOM from 'react-dom';

const cun = (count) => count + 1;

function App() {
    return (
        <div>
            <h1>My Hacker Stories</h1>

            <label htmlfor="search">Search</label>
            <input id="search" type="text" />

            <hr />
        </div>
    );
}

export default App;
