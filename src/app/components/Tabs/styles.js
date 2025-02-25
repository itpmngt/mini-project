import styled from "styled-components";

export const TabList = styled.div`
    display: flex;
    border-bottom: 1px solid #f2f2f2;
`;

export const Tab = styled.button`
    padding: 4px 8px;
    margin: 0 5px;
    cursor: pointer;
    border: 1px solid #f2f2f2;
    background: ${props => props.active ? "#333" : "white"};
    color: ${props => props.active ? "white" : "#333"};
    border-radius: 4px 4px 0 0;
    position: relative;
    top: 1px;
`;

export const TabPanel = styled.div`
    padding-top:30px;
`;
