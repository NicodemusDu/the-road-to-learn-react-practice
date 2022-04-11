import React from 'react';
import StyledItem, { StyledColumn, StyledButton } from './List.css';
import { sortBy } from 'lodash';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
    POINTS: (list) => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false,
    });
    const handleSort = (sortKey) => {
        console.log(sortKey);
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey, isReverse });
    };
    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);

    const getButtonText = (text, sort) => {
        console.log('getButtonText\t', sort);
        if (String(text).toLowerCase() === sort.sortKey.toLowerCase()) {
            return sort.isReverse ? '↑' : '↓';
        }
    };

    return (
        <div>
            <StyledItem>
                <StyledColumn width="50%">
                    <StyledButton
                        type="button"
                        onClick={() => handleSort('TITLE')}
                    >
                        Title{getButtonText('Title', sort)}
                    </StyledButton>
                </StyledColumn>
                <StyledColumn width="20%">
                    <StyledButton
                        type="button"
                        onClick={() => handleSort('AUTHOR')}
                    >
                        Author{getButtonText('Author', sort)}
                    </StyledButton>
                </StyledColumn>
                <StyledColumn width="10%">
                    <StyledButton
                        type="button"
                        onClick={() => handleSort('COMMENTS')}
                    >
                        Comments{getButtonText('Comments', sort)}
                    </StyledButton>
                </StyledColumn>
                <StyledColumn width="10%">
                    <StyledButton
                        type="button"
                        onClick={() => handleSort('POINTS')}
                    >
                        Points{getButtonText('Points', sort)}
                    </StyledButton>
                </StyledColumn>
                <StyledColumn width="10%">Actions</StyledColumn>
            </StyledItem>
            {sortedList.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    );
};

const Item = ({ item, onRemoveItem }) => (
    <StyledItem>
        <StyledColumn width="50%">
            <a href={item.url}>{item.title}</a>
        </StyledColumn>
        <StyledColumn width="20%">{item.author}</StyledColumn>
        <StyledColumn width="10%">{item.num_comments}</StyledColumn>
        <StyledColumn width="10%">{item.points}</StyledColumn>
        <StyledColumn width="10%">
            <button type="button" onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </StyledColumn>
    </StyledItem>
);

// export default List;
export default List;
export { Item };
