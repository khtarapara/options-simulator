import styled from "styled-components";

export const StyledTable = styled.table`
  margin: 0;
  border-spacing: 0;
  width: 100%;

  th,
  td {
    padding: 10px;
    text-align: center;
  }
`;

export const StyledTableHead = styled.thead`
  background-color: #e0e0e0;
  position: sticky;
  top: 0;
  ${(props) => props.css && props.css}
`;

export const StyledTableRow = styled.tr`
  :nth-of-type(even) {
    background: #f5f5f5;
  }

  ${(props) => props.css && props.css}
`;

export const StyledTableData = styled.td`
  ${(props) => props.css && props.css}
`;

export const StyledColumnHeader = styled.th`
  ${(props) => props.css && props.css}
`;

export const StyledColumnFooter = styled.th`
  ${(props) => props.css && props.css}
`;

export const StyledTableFooter = styled.tfoot`
  background-color: #e0e0e0;
  ${(props) => props.css && props.css}
`;
