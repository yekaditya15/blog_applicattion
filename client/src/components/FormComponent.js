import React from "react";

const FormComponent = ({ onSubmit, inputs }) => {
  return (
    <form onSubmit={onSubmit}>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            type={input.type}
            value={input.value}
            onChange={input.onChange}
            placeholder={input.placeholder}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;
