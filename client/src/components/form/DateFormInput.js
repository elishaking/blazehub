import React from 'react';

export function DateFormInput({ name, placeholder, onChange, error, value = null }) {
  return (
    <div className="form-input" data-test="dateFormInputComponent">
      <input
        type="date"
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