import React from 'react';
import ReactDOM from 'react-dom';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const App = () => {
    const useSemiPersistentState = (key, initState) => {
        const [value, setValue] = React.useState(
            localStorage.getItem(key) || initState
        );

        React.useEffect(() => {
            localStorage.setItem(key, value);
        }, [value, key]);
        return [value, setValue];
    };
    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const storiesReducer = (state, action) => {
        switch (action.type) {
            case 'STORIES_FETCH_INIT':
                return {
                    ...state,
                    isLoding: true,
                    isError: false,
                };
            case 'STORIES_FETCH_SUCCESS':
                return {
                    ...state,
                    data: action.payload,
                    isLoding: false,
                    isError: false,
                };
            case 'STORIES_FETCH_FAILURE':
                return {
                    ...state,
                    isLoding: false,
                    isError: true,
                };
            case 'REMOVE_STORY':
                return {
                    ...state,
                    data: state.data.filter(
                        (story) => action.payload.objectID !== story.objectID
                    ),
                };
            default:
                throw new Error();
        }
    };
    const [stories, dispatchStories] = React.useReducer(storiesReducer, {
        data: [],
        isLoding: false,
        isError: false,
    });

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const [searchStories, setSearchStories] = React.useState([]);

    React.useEffect(() => {
        setSearchStories(
            stories.data.filter(function (story) {
                return story.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            })
        );
    }, [stories, searchTerm]);

    // Effect会在首次渲染的时候会被执行一次
    React.useEffect(() => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        fetch(`${API_ENDPOINT}react`)
            .then((response) => response.json())
            .then((result) =>
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.hits,
                })
            )
            .catch(() =>
                dispatchStories({
                    type: 'STORIES_FETCH_FAILURE',
                })
            );
    }, []);

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
            {stories.isError && <p>Something went wrong...</p>}
            {stories.isLoding ? (
                <p>Loding...</p>
            ) : (
                <List list={searchStories} onRemoveItem={handleRemoveStory} />
            )}
        </>
    );
};
const List = ({ list, onRemoveItem }) =>
    list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ));

const Item = ({ item, onRemoveItem }) => {
    return (
        <div>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <span> {item.author} </span>
            <span> {item.num_comments} </span>
            <span> {item.points} </span>
            <span>
                <button type="button" onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
        </div>
    );
};
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
