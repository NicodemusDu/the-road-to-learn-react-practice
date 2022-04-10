import styled from 'styled-components';
export const StyledContainer = styled.div`
    height: 100vw;
    padding: 20px;

    background: #83a4d4;
    background: linear-gradient(to left, #bbbbbb, #222222);

    color: #171212;
`;

export const StyledHeadlinePrimary = styled.h1`
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 2px;
`;

export const StyleItem = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
`;

export const StyleColumn = styled.span`
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

export const StyledButton = styled.button`
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

export const StyledButtonSmall = styled(StyledButton)`
    padding: 5px;
`;

export const StyledButtonLarge = styled(StyledButton)`
    padding: 10px;
`;
export const StyledButtonForm = styled(StyledButton)`
    padding: 10px 0 20px 0;
    display: flex;
    align-items: baseline;
`;

export const StyledLabel = styled.label`
    border-top: 1px solid #171212;
    border-left: 1px solid #171212;
    padding-left: 5px;
    font-size: 24px;
`;
export const StyledInput = styled.input`
    border: none;
    border-bottom: 1px solid #171212;
    background-color: transparent;
    font-size: 24px;
`;

export const themeSetting = {
    main: 'palevioletred',
};
