import React from 'react';
import axios from 'axios';
import List from './list/List';
import SearchForm from './SearchForm';
import LastSearches from './LastSearches';
import Styled from 'styled-components';

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
                data: action.page
                    ? state.data.concat(action.payload)
                    : action.payload,
                page: action.page + 1,
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
        page: 0,
        isLoading: false,
        isError: false,
    });

    const getUrl = (url) => API_ENDPOINT + url;

    const handleFetchStories = React.useCallback(
        async (page = 0) => {
            dispatchStories({ type: 'STORIES_FETCH_INIT' });

            try {
                let url = getUrl(urls[urls.length - 1]);
                url = url + '&page=' + page;
                console.log('url', url);

                const result = await axios.get(url);

                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.data.hits,
                    page: result.data.page,
                });
            } catch {
                dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
            }
        },
        [urls]
    );

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

    const handleMore = (page) => {
        handleFetchStories(page);
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
            <List list={stories.data} onRemoveItem={handleRemoveStory} />
            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <StyledMoreButton
                    type="button"
                    onClick={() => handleMore(stories.page)}
                >
                    More
                </StyledMoreButton>
            )}
            <hr />
        </div>
    );
};

const StyledMoreButton = Styled.button`
    display: block;
    margin:0 auto;

    background-color: #4CAF50;
    border: none;
    border-radius: 2px;
    color:  white;
    padding: 15px 32px;
    text-align:center;
    text-decoration: none;
    font-size: 24px;

    &:hover{
        color: black;
    }

    &:active{
        color: black;
        background-color: #777777;
    }
`;

export default App;
