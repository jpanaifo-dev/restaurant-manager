import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white text-center py-2 mt-auto">
    &copy; {new Date().getFullYear()} Restaurant POS
  </footer>
);

export default Footer;
