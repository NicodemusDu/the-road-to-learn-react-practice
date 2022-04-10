import Styled from 'styled-components';

const StyledItem = Styled.div`
    display: flex;
    background: #ffffff
`;
const StyledColumn = Styled.span`
    padding: 0 5 px;
    width:${(props) => props.width};
`;

export default StyledItem;
export { StyledColumn };
