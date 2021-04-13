/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { CategoryEnum } from "../../enums";

const CreateTicketForm = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: CategoryEnum.BUG,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const formStyle = css`
    width: 400px;
  `;

  const labelStyle = css`
    font-size: 1.1rem;
  `;

  const inputStyle = css`
    box-sizing: border-box;
    margin: 10px 0px;
    width: 100%;
    border: 2px solid #999;
    border-radius: 5px;
    padding: 8px;
    background-color: #fff;
    font-size: 1rem;
    outline: none;
    &:focus {
      border-width: 2px;
    }
  `;

  const textAreaStyle = css`
    height: 100px;
    font-family: inherit;
    resize: none;
  `;

  const optionStyle = css`
    padding: 100px;
  `;

  const buttonStyle = css`
    background-color: #09f;
    border-radius: 5px;
    padding: 10px;
    user-select: none;
    transition: background-color 0.5s;
    color: #fff;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
      background-color: #08f;
    }
  `;

  const errorStyle = css`
    background-color: #86e;
    border-radius: 5px;
    text-align: center;
    padding: 10px;
    margin-top: 15px;
    color: #fff;
  `;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previousFormValues) => ({
      ...previousFormValues,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formValues.title.length < 5 || formValues.title.length > 100) {
      throw new Error("Title should be between 5 to 100 characters.");
    }

    if (formValues.description.length > 1000) {
      throw new Error("Description should be less than 1000 characters.");
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      validateForm();
      onSubmit(formValues);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} css={formStyle}>
      <label htmlFor="form-ticket-title" css={labelStyle}>
        Title
        <br />
        <input
          type="text"
          id="form-ticket-title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          css={inputStyle}
        />
      </label>
      <br />
      <label htmlFor="form-ticket-description" css={labelStyle}>
        Description
        <br />
        <textarea
          id="form-ticket-description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          css={[inputStyle, textAreaStyle]}
        />
      </label>
      <br />
      <label htmlFor="form-ticket-category" css={labelStyle}>
        Category
        <br />
        <select
          id="form-ticket-category"
          name="category"
          value={formValues.category}
          onChange={handleChange}
          css={inputStyle}
        >
          <option value={CategoryEnum.BUG} css={optionStyle}>
            Bug
          </option>
          <option value={CategoryEnum.FEATURE_REQUEST} css={optionStyle}>
            Feature Request
          </option>
          <option value={CategoryEnum.TECHNICAL_ISSUE} css={optionStyle}>
            Technical Issue
          </option>
          <option value={CategoryEnum.ACCOUNT} css={optionStyle}>
            Account
          </option>
        </select>
      </label>
      <br />
      <input type="submit" value="Create" css={buttonStyle} />
      {errorMessage && (
        <div role="alert" css={errorStyle}>
          {errorMessage}
        </div>
      )}
    </form>
  );
};

CreateTicketForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CreateTicketForm;
