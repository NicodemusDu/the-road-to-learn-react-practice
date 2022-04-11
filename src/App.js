import React from 'react';
import axios from 'axios';
import List from './list/List';
import SearchForm from './SearchForm';
import LastSearches from './LastSearches';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
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
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
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

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        'React'
    );

    const [urls, setUrls] = React.useState([searchTerm]);

    const [stories, dispatchStories] = React.useReducer(storiesReducer, {
        data: [],
        isLoading: false,
        isError: false,
    });

    const getUrl = (url) => API_ENDPOINT + url;

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(getUrl(urls[urls.length - 1]));

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [urls]);

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
        handleSearch(searchTerm);
        event.preventDefault();
    };

    const handleLastSearch = (url) => {
        setSearchTerm(url);
        handleSearch(url);
    };

    const handleSearch = (searchTerm) => {
        setUrls(urls.concat(searchTerm));
    };

    const getLastSearches = (urls) => {
        const last = urls.reduce((result, url) => {
            if (!(result instanceof Array)) {
                result = [result];
            }
            if (result[result.length - 1] !== url) {
                result.push(url);
            }
            return result;
        });
        if (last instanceof Array) {
            return last.slice(-5);
        } else {
            return urls;
        }
    };
    const lastSearch = getLastSearches(urls);
    return (
        <div>
            <h1>My Hacker Stories</h1>
            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            <LastSearches
                lastSearches={lastSearch}
                onLastSearch={handleLastSearch}
            />
            <hr />
            {/* <Sort /> */}
            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory} />
            )}
        </div>
    );
};

export default App;
