import React from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const useSemiPersistentState = (key, initState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);
    return [value, setValue];
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
const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused={true}
                onInputChange={onSearchInput}
            >
                Search
            </InputWithLabel>
            <button type="submit" disabled={!searchTerm}>
                Submit
            </button>
        </form>
    );
};

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        'React'
    );

    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

    const [stories, dispatchStories] = React.useReducer(storiesReducer, {
        data: [],
        isLoding: false,
        isError: false,
    });

    // Effect会在首次渲染的时候会被执行一次
    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault(); // 阻止浏览器重新加载
    };

    return (
        <>
            <h1>My Hacker Stories</h1>
            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />
            <hr />
            {stories.isError && <p>Something went wrong...</p>}
            {stories.isLoding ? (
                <p>Loding...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory} />
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
