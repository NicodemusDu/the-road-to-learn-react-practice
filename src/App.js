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
    const [searchTerm, setSearchTerm] = React.useState('React');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        console.log('handleSearch: ', event.target.value);
    };

    const searchStories = stories.filter(function (story) {
        console.log('searchStories: ', story.title);
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <h1>My Hacker Stories</h1>
            <Search search={searchTerm} onSearch={handleSearch} />
            <hr />
            <List list={searchStories} />
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
    return (
        <div>
            <label htmlfor="search">Search</label>
            <input
                id="search"
                type="text"
                value={props.search}
                onChange={props.onSearch}
            />
        </div>
    );
};
export default App;
