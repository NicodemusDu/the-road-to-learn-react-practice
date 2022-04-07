import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const stories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0,
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ];

    return (
        <div>
            <h1>My Hacker Stories</h1>
            <Search
                onSearch={(event) =>
                    console.log('onSearch: ', event.target.value)
                }
            />
            <hr />
            <List list={stories} />
        </div>
    );
};
const List = (props) =>
    props.list.map((item) => (
        <div key={item.objectID}>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
        </div>
    ));
const Search = (props) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        props.onSearch(event);
    };

    return (
        <div>
            <label htmlfor="search">Search</label>
            <input id="search" type="text" onChange={handleChange} />

            <p>
                Searching for <strong>{searchTerm}</strong>
            </p>
        </div>
    );
};
export default App;
