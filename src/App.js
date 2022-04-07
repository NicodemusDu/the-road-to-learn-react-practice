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
        <>
            <h1>My Hacker Stories</h1>
            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused={true}
                onInputChange={handleSearch}
            >
                Search
            </InputWithLabel>
            <hr />
            <List list={searchStories} />
        </>
    );
};
const List = ({ list }) =>
    list.map((item) => <Item key={item.objectID} item={item} />);
const Item = ({ item }) => (
    <>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
    </>
);
const InputWithLabel = ({
    id,
    value,
    type = 'text',
    isFocused,
    onInputChange,
    children,
}) => {
    const inputRef = React.useRef();
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);
    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
            />
        </>
    );
};
export default App;
