import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="absolute inset-x-0 bottom-0 h-7 bg-black text-white py-1 text-center mt-auto">
      <p>
        &copy; {new Date().getFullYear()} Recipe Manager. All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;
