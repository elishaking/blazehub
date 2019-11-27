import React from 'react';

export function TextFormInput({ type, name, placeholder, onChange, error, value = null }) {
  return (
    <div className="form-input">
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
    <div className="form-input">
      <textarea
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
