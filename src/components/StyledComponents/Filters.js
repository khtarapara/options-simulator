import styled from "styled-components";

export const FilterContainer = styled.div`
  display: flex;
  column-gap: 10px;
  justify-content: space-between;
  background-color: #c1c5d2;
  border-radius: 10px;
  border: 1px solid #08174b;
  flex-wrap: wrap;

  label {
    font-weight: 550;
  }
`;

export const FilterItem = styled.div`
  display: flex;
  width: 15%;
  column-gap: 10px;
  padding: 10px;
  align-items: center;

  ${(props) => props.css && props.css}
`;
