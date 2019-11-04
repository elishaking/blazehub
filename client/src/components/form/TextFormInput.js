import React from 'react';

export default function TextFormInput({ type, name, placeholder, onChange, error }) {
  return (
    <div className="form-input">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`fill-parent ${error ? "error" : ""}`} onChange={onChange} />
      {
        error && (<small>{error}</small>)
      }
    </div>
  )
}
