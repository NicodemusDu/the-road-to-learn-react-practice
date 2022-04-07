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

    const useSemiPersistentState = (key, initState) => {
        const [value, setValue] = React.useState(
            localStorage.getItem(key) || initState
        );

        React.useEffect(() => {
            localStorage.setItem(key, value);
        }, [value, key]);
        return [value, setValue];
    };
    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        'React'
    );

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
    list.map((item) => <Item key={item.objectID} item={item} />);
const Item = ({ item }) => (
    <div>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
    </div>
);
const Search = ({ search, onSearch }) => (
    <div>
        <label htmlFor="search">Search</label>
        <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
);
export default App;
