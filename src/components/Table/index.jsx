import React from "react";
import PropTypes from "prop-types";
import {
  StyledTable,
  StyledTableRow,
  StyledTableData,
  StyledTableHead,
  StyledColumnHeader,
  StyledTableFooter,
} from "./StyledTableComponents";
import { css } from "styled-components";
import { isFn } from "../../utils/utils";

const get = (obj, key, args) => (isFn(obj[key]) ? obj[key](args) : obj[key]);

export const Table = React.forwardRef(
  ({ data, columns, css: cssProp, disableFooter }, ref) => {
    return (
      <StyledTable ref={ref}>
        <StyledTableHead css={get(cssProp, "head")}>
          <tr>
            {columns.map((column) => (
              <StyledColumnHeader
                key={column.id}
                css={get(cssProp, "header", column)}
              >
                {get(column, "header")}
              </StyledColumnHeader>
            ))}
          </tr>
        </StyledTableHead>
        <tbody>
          {data.length ? (
            data.map((row, index) => {
              return (
                <StyledTableRow key={index} css={get(cssProp, "row", row)}>
                  {columns.map((column) => (
                    <StyledTableData
                      key={column.id}
                      css={get(cssProp, "data", { row, column })}
                    >
                      {column.cell
                        ? column.cell({ ...row, index })
                        : row[column.accessor]}
                    </StyledTableData>
                  ))}
                </StyledTableRow>
              );
            })
          ) : (
            <StyledTableRow>
              <StyledTableData colSpan={columns.length}>
                <center>No Data Available</center>
              </StyledTableData>
            </StyledTableRow>
          )}
        </tbody>
        {!disableFooter && (
          <StyledTableFooter css={get(cssProp, "foot")}>
            <tr>
              {columns.map((column) => (
                <StyledColumnHeader
                  key={column.id}
                  css={get(cssProp, "footer", {
                    column,
                    footer: get(column, "footer"),
                  })}
                >
                  {get(column, "footer")}
                </StyledColumnHeader>
              ))}
            </tr>
          </StyledTableFooter>
        )}
      </StyledTable>
    );
  }
);

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  css: PropTypes.object,
  disableFooter: PropTypes.bool,
};

Table.defaultProps = {
  disableFooter: false,
  css: {
    table: css``,
    head: css``,
    header: () => css``,
    row: () => css``,
    data: () => css``,
    foot: css``,
    footer: () => css``,
  },
};
