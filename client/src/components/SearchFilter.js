/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { CategoryEnum, StatusEnum } from "../enums";

const SearchFilter = ({ initialStatus, initialCategory, onFilter }) => {
  const [filter, setFilter] = useState({
    status: initialStatus,
    category: initialCategory,
  });

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

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilter((previousFilter) => {
      const newFilter =
        value === "All"
          ? { ...previousFilter, [name]: null }
          : { ...previousFilter, [name]: value };

      onFilter(newFilter);
      return newFilter;
    });
  };

  return (
    <div role="search" css={searchFilterStyle}>
      <div css={statusStyle}>
        <label htmlFor="filter-status">
          Status
          <select
            id="filter-status"
            name="status"
            value={filter.status || "All"}
            onChange={handleFilter}
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
      <div css={statusStyle}>
        <label htmlFor="filter-category">
          Category
          <select
            id="filter-category"
            name="category"
            value={filter.category || "All"}
            onChange={handleFilter}
            css={selectStyle}
          >
            <option>All</option>
            <option value={CategoryEnum.BUG}>Bug</option>
            <option value={CategoryEnum.FEATURE_REQUEST}>
              Feature Request
            </option>
            <option value={CategoryEnum.TECHNICAL_ISSUE}>
              Technical Issue
            </option>
            <option value={CategoryEnum.ACCOUNT}>Account</option>
          </select>
        </label>
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  initialStatus: PropTypes.string,
  initialCategory: PropTypes.string,
  onFilter: PropTypes.func.isRequired,
};

SearchFilter.defaultProps = {
  initialStatus: null,
  initialCategory: null,
};

export default SearchFilter;
