/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks";

const EditableSelect = ({
  options,
  onChange,
  disabled,
  children,
  ariaLabelledBy,
  className,
}) => {
  const [isEditing, setEditing] = useState(false);
  const ref = useRef();

  useClickOutside(
    ref,
    () => {
      setEditing(false);
    },
    isEditing
  );

  const editableStyle = css`
    display: flex;
    align-items: center;
    padding: 0px 10px;
    position: relative;
    outline: none;
    border-radius: 5px;
    transition: background-color 0.5s;
  `;

  const enabledStyle = css`
    cursor: pointer;
    &:hover {
      background-color: #222;
    }
  `;

  const listStyle = css`
    font-size: 0.8rem;
    position: absolute;
    top: 30px;
    list-style-type: none;
    padding: 0px;
    z-index: 100;
  `;

  const listItemStyle = css`
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid #333;
    padding: 5px;
    width: 100px;
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #333;
    }
  `;

  const handleClickEditable = () => {
    setEditing(true);
  };

  const handleClickOption = (value) => (event) => {
    setEditing(false);
    onChange(value);
    event.stopPropagation();
  };

  return (
    <div
      onClick={disabled ? undefined : handleClickEditable}
      onKeyDown={disabled ? undefined : handleClickEditable}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-labelledby={ariaLabelledBy}
      css={[editableStyle, !disabled && enabledStyle]}
      className={className}
    >
      {children}
      {isEditing && (
        <ul
          ref={ref}
          role="listbox"
          aria-labelledby={ariaLabelledBy}
          css={listStyle}
        >
          {options.map((option) => {
            return (
              <li
                key={option.value}
                onClick={handleClickOption(option.value)}
                onKeyDown={handleClickOption(option.value)}
                role="option"
                aria-selected="false"
                tabIndex="0"
                css={listItemStyle}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

EditableSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
  ariaLabelledBy: PropTypes.string,
  className: PropTypes.string,
};

EditableSelect.defaultProps = {
  disabled: false,
  ariaLabelledBy: "",
  className: "",
};

export default EditableSelect;
