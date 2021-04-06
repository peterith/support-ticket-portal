/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

const EditableTextArea = ({ onBlur, children, ariaLabelledBy, className }) => {
  const [isEditing, setEditing] = useState(false);
  const [textArea, setTextArea] = useState(children);
  const ref = useRef();

  const editableStyle = css`
    display: flex;
    align-items: center;
    outline: none;
    border-radius: 5px;
    transition: background-color 0.5s;
    &:hover {
      cursor: pointer;
      background-color: #222;
    }
  `;

  const textStyle = css`
    padding: 0px 10px;
  `;

  const textAreaStyle = css`
    height: 100px;
    border-radius: 5px;
    width: 100%;
    font-family: inherit;
    resize: none;
    padding: 8px;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-width: 2px;
    }
  `;

  const handleClickEditable = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setTextArea(event.target.value);
  };

  const handleBlur = () => {
    setEditing(false);

    if (children !== textArea) {
      onBlur(textArea);
    }
  };

  return (
    <div
      onClick={handleClickEditable}
      onKeyDown={handleClickEditable}
      role="button"
      tabIndex="0"
      css={editableStyle}
      className={className}
    >
      {isEditing ? (
        <textarea
          ref={ref}
          value={textArea}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          aria-labelledby={ariaLabelledBy}
          css={textAreaStyle}
        />
      ) : (
        <p aria-labelledby={ariaLabelledBy} css={textStyle}>
          {children}
        </p>
      )}
    </div>
  );
};

EditableTextArea.propTypes = {
  onBlur: PropTypes.func.isRequired,
  children: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  className: PropTypes.string,
};

EditableTextArea.defaultProps = {
  children: "",
  ariaLabelledBy: "",
  className: "",
};

export default EditableTextArea;
