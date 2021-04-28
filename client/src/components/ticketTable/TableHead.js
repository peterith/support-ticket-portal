/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const TableHead = () => {
  const theadStyle = css`
    background-color: #444;
    color: #fff;
    font-size: 1.1rem;
  `;

  const thStyle = css`
    padding: 15px;
  `;

  return (
    <thead css={theadStyle}>
      <tr>
        <th css={thStyle}>ID</th>
        <th css={thStyle}>Title</th>
        <th css={thStyle}>Status</th>
        <th css={thStyle}>Category</th>
        <th css={thStyle}>Priority</th>
      </tr>
    </thead>
  );
};

export default TableHead;
