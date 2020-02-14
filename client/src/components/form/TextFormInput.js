import React from 'react';

export function TextFormInput({ type, name, placeholder, onChange, error, value = null }) {
  return (
    <div className="form-input" data-test="textFormInputComponent">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className={`fill-parent ${error ? "error" : ""}`} onChange={onChange} />
      {
        error && (<small>{error}</small>)
      }
    </div>
  )
}

export function TextAreaFormInput({ name, placeholder, onChange, error, value = null }) {
  return (
    <div className="form-input" data-test="textAreaFormInputComponent">
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        rows={3}
        style={{ resize: "none" }}
        className={`fill-parent ${error ? "error" : ""}`} onChange={onChange} />
      {
        error && (<small>{error}</small>)
      }
    </div>
  )
}
