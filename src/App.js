import React from 'react';
import axios from 'axios';
import cs from 'classname';

import styles from './App.module.css';
import styled, { ThemeProvider } from 'styled-components';

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
        <form onSubmit={onSearchSubmit} className={styles.searchForm}>
            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused={true}
                onInputChange={onSearchInput}
            >
                Search
            </InputWithLabel>
            <StyledButtonLarge type="submit" disabled={!searchTerm}>
                Submit
            </StyledButtonLarge>
        </form>
    );
};

const StyledContainer = styled.div`
    height: 100vw;
    padding: 20px;

    background: #83a4d4;
    background: linear-gradient(to left, #ff0000, #83a4d4);

    color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 2px;
`;

const StyleItem = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
`;

const StyleColumn = styled.span`
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    a {
        color: ${(props) => props.theme.main};
    }

    width: ${(props) => props.width};
`;

const StyledButton = styled.button`
    background: transparent;
    border: 1px solid #121212;
    padding: 5px;
    cursor: pointer;

    transition: all 0.1s ease-in;

    &:hover {
        background: #121212;
        color: #ffffff;
    }
`;

const StyledButtonSmall = styled(StyledButton)`
    padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
    padding: 10px;
`;
const StyledButtonForm = styled(StyledButton)`
    padding: 10px 0 20px 0;
    display: flex;
    align-items: baseline;
`;

const StyledLabel = styled.label`
    border-top: 1px solid #171212;
    border-left: 1px solid #171212;
    padding-left: 5px;
    font-size: 24px;
`;
const StyledInput = styled.input`
    border: none;
    border-bottom: 1px solid #171212;
    background-color: transparent;
    font-size: 24px;
`;

const themeSetting = {
    main: 'palevioletred',
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
        <StyledContainer>
            <ThemeProvider theme={themeSetting}>
                <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
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
                    <List
                        list={stories.data}
                        onRemoveItem={handleRemoveStory}
                    />
                )}
            </ThemeProvider>
        </StyledContainer>
    );
};
const List = ({ list, onRemoveItem }) =>
    list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ));

const Item = ({ item, onRemoveItem }) => {
    return (
        <StyleItem>
            <StyleColumn style={{ width: '50%' }}>
                <a href={item.url}>{item.title}</a>
            </StyleColumn>
            <StyleColumn style={{ width: '20%' }}> {item.author} </StyleColumn>
            <StyleColumn style={{ width: '10%' }}>
                {item.num_comments}
            </StyleColumn>
            <StyleColumn style={{ width: '10%' }}> {item.points} </StyleColumn>
            <StyleColumn style={{ width: '10%' }}>
                <StyledButtonSmall
                    type="button"
                    onClick={() => onRemoveItem(item)}
                >
                    Dismiss
                </StyledButtonSmall>
            </StyleColumn>
        </StyleItem>
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
            <StyledLabel htmlFor={id}>{children}</StyledLabel>
            &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
                className={styles.input}
            />
        </>
    );
};
export default App;
