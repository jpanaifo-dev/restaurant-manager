import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => (
  <input {...props} className={`border px-2 py-1 rounded ${props.className ?? ''}`} />
);

export default Input;
