/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import PropTypes from "prop-types";

const SignInForm = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const formStyle = css`
    width: 300px;
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

  const buttonStyle = css`
    background-color: #3d3;
    border-radius: 5px;
    padding: 10px;
    user-select: none;
    transition: background-color 0.5s;
    color: #fff;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
      background-color: #1c1;
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

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await onSubmit(formValues);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} css={formStyle}>
      <label htmlFor="form-username" css={labelStyle}>
        Username
        <br />
        <input
          type="text"
          id="form-username"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          css={inputStyle}
        />
      </label>
      <br />
      <label htmlFor="form-password" css={labelStyle}>
        Password
        <br />
        <input
          type="password"
          id="form-password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          css={inputStyle}
        />
      </label>
      <br />
      <input type="submit" value="Sign In" css={buttonStyle} />
      {errorMessage && (
        <div role="alert" css={errorStyle}>
          {errorMessage}
        </div>
      )}
    </form>
  );
};

SignInForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
