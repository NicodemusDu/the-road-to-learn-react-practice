import Styled from 'styled-components';

const StyledItem = Styled.div`
    display: flex;
    background: #ffffff;
    padding-left: 10px;
`;
const StyledColumn = Styled.span`
    padding: 0 5 px;
    
    width:${(props) => props.width};
`;

const StyledButton = Styled.button`

`;

export default StyledItem;
export { StyledColumn, StyledButton };
