import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button {...props} className={`px-4 py-2 rounded bg-blue-600 text-white ${props.className ?? ''}`}>
    {children}
  </button>
);

export default Button;
