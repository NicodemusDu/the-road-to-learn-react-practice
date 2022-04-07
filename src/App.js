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
const List = ({ list }) =>
    list.map(({ objectID, ...item }) => <Item key={objectID} {...item} />);

const Item = ({ title, url, author, num_comments, points }) => (
    <div>
        <span>
            <a href={url}>{title}</a>
        </span>
        <span>{author}</span>
        <span>{num_comments}</span>
        <span>{points}</span>
    </div>
);

const Search = ({ search, onSearch }) => (
    <div>
        <label htmlFor="search">Search</label>
        <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
);
export default App;
