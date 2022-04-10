import React from 'react';
import StyledItem, { StyledColumn } from './List.css';
import { sortBy } from 'lodash';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),

    NONE_REVERSE: (list) => list,
    TITLE_REVERSE: (list) => sortBy(list, 'title').reverse(),
    AUTHOR_REVERSE: (list) => sortBy(list, 'author').reverse(),
    COMMENT_REVERSE: (list) => sortBy(list, 'num_comments'),
    POINT_REVERSE: (list) => sortBy(list, 'points'),
};

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState('NONE');
    const handleSort = (sortKey) => {
        console.log(sortKey);
        if (sort === sortKey) {
            sortKey += '_REVERSE';
        }
        setSort(sortKey);
    };
    console.log('sort: \t', sort);
    const sortFunction = SORTS[sort];
    const sortedList = sortFunction(list);

    return (
        <div>
            <StyledItem>
                <StyledColumn width="50%">
                    <button type="button" onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </StyledColumn>
                <StyledColumn width="20%">
                    <button type="button" onClick={() => handleSort('AUTHOR')}>
                        Author
                    </button>
                </StyledColumn>
                <StyledColumn width="10%">
                    <button type="button" onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </StyledColumn>
                <StyledColumn width="10%">
                    <button type="button" onClick={() => handleSort('POINT')}>
                        Points
                    </button>
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
