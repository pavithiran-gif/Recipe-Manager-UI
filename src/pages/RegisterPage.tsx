import React from "react";
import Registercomp from "../components/Register";

const RegisterPage: React.FC = () => {
  return (
    <div className="">
      <div className="flex  justify-center">
        <Registercomp toggleForm={() => {}} />
      </div>
    </div>
  );
};

export default RegisterPage;
