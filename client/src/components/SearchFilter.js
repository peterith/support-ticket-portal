/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { StatusEnum } from "../enums";

const SearchFilter = ({ status, onFilterByStatus }) => {
  const searchFilterStyle = css`
    display: flex;
    align-items: center;
    color: #fff;
    background-color: #333;
  `;

  const statusStyle = css`
    padding: 10px 20px;
  `;

  const selectStyle = css`
    margin-left: 10px;
    width: 150px;
    border: 2px solid #999;
    border-radius: 5px;
  `;

  const handleSelectStatus = (event) => {
    const { value } = event.target;

    if (value === "All") {
      onFilterByStatus(null);
    } else {
      onFilterByStatus(value);
    }
  };

  return (
    <div role="search" css={searchFilterStyle}>
      <div css={statusStyle}>
        <label htmlFor="filter-status">
          Status
          <select
            id="filter-status"
            value={status || "All"}
            onChange={handleSelectStatus}
            css={selectStyle}
          >
            <option>All</option>
            <option value={StatusEnum.OPEN}>Open</option>
            <option value={StatusEnum.IN_PROGRESS}>In Progress</option>
            <option value={StatusEnum.RESOLVED}>Resolved</option>
            <option value={StatusEnum.CLOSED}>Closed</option>
          </select>
        </label>
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  status: PropTypes.string,
  onFilterByStatus: PropTypes.func.isRequired,
};

SearchFilter.defaultProps = {
  status: "",
};

export default SearchFilter;
