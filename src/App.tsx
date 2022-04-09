import React from 'react';
import axios from 'axios';
// import cs from 'classname';

import { ReactComponent as Check } from './check.svg';

import styles from './App.module.css';
import { ThemeProvider } from 'styled-components';
import * as myStyled from './Css.tsx';

type Story = {
    objectID: string;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
};

type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

type Stories = Array<Story>;
type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
};

type StoriesState = {
    data: Stories;
    isLoding: boolean;
    isError: boolean;
};

interface StoriesFetchInitAction {
    type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Stories;
}
interface StoriesFetchFailureAction {
    type: 'STORIES_FETCH_FAILURE';
}
interface StoriesRemoveAction {
    type: 'REMOVE_STORY';
    payload: Story;
}
type StoriesAction =
    | StoriesFetchInitAction
    | StoriesFetchSuccessAction
    | StoriesFetchFailureAction
    | StoriesRemoveAction;

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type InputWithLabelProps = {
    id: string;
    value: string;
    type?: string;
    isFocused?: boolean;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
};
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const useSemiPersistentState = (
    key: string,
    initState: string
): [string, (newValue: string) => void] => {
    const isMounted = React.useRef(false); // 避免浏览器首次渲染的时候调用effect

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initState
    );

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            localStorage.setItem(key, value);
            console.log('run useEffect');
        }
    }, [value, key]);
    return [value, setValue];
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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
const SearchForm = React.memo(
    ({ searchTerm, onSearchInput, onSearchSubmit }: SearchFormProps) => {
        console.debug(' run SearchForm');
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
                <myStyled.StyledButtonLarge
                    type="submit"
                    disabled={!searchTerm}
                >
                    <Check height="18px" width="18px" />
                </myStyled.StyledButtonLarge>
            </form>
        );
    }
);

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

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            console.log('run handleFetchStories');
            const result = await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);

    // Effect会在首次渲染的时候会被执行一次
    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = React.useCallback((item: Story) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    }, []);

    const handleSearchInput = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
        },
        []
    );

    const handleSearchSubmit = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            setUrl(`${API_ENDPOINT}${searchTerm}`);
            event.preventDefault(); // 阻止浏览器重新加载
        },
        []
    );

    const getSumComments = (stories) => {
        console.log('run getSumComments');

        return stories.data.reduce(
            (result, value) => result + value.num_comments,
            0
        );
    };
    const sumComments = React.useMemo(() => getSumComments(stories), [stories]);
    console.log('run App');
    return (
        <myStyled.StyledContainer>
            <ThemeProvider theme={myStyled.themeSetting}>
                <myStyled.StyledHeadlinePrimary>
                    My Hacker Stories: {sumComments}
                </myStyled.StyledHeadlinePrimary>
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
        </myStyled.StyledContainer>
    );
};
const List = React.memo(({ list, onRemoveItem }: ListProps) => {
    console.log('run List');
    return (
        <>
            {list.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
            ;
        </>
    );
});

const Item = ({ item, onRemoveItem }: ItemProps) => {
    console.debug('run Item');
    return (
        <myStyled.StyleItem>
            <myStyled.StyleColumn style={{ width: '50%' }}>
                <a href={item.url}>{item.title}</a>
            </myStyled.StyleColumn>
            <myStyled.StyleColumn style={{ width: '20%' }}>
                {' '}
                {item.author}{' '}
            </myStyled.StyleColumn>
            <myStyled.StyleColumn style={{ width: '10%' }}>
                {item.num_comments}
            </myStyled.StyleColumn>
            <myStyled.StyleColumn style={{ width: '10%' }}>
                {' '}
                {item.points}{' '}
            </myStyled.StyleColumn>
            <myStyled.StyleColumn style={{ width: '10%' }}>
                <myStyled.StyledButtonSmall
                    type="button"
                    onClick={() => onRemoveItem(item)}
                >
                    Dismiss
                </myStyled.StyledButtonSmall>
            </myStyled.StyleColumn>
        </myStyled.StyleItem>
    );
};
const InputWithLabel = ({
    id,
    value,
    type = 'text',
    isFocused,
    onInputChange,
    children,
}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null!);
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);
    return (
        <>
            <myStyled.StyledLabel htmlFor={id}>{children}</myStyled.StyledLabel>
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
