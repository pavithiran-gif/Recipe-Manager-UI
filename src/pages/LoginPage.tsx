import React, { useState } from "react";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Logo from "../assets/Recipe_maker_logo.svg";
import Registration from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import "../index.css";

const LoginPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<
    "login" | "register" | "forgotPassword"
  >("login");

  const toggleForm = (form: "login" | "register" | "forgotPassword") => {
    setActiveForm(form);
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center">
      <main className="flex justify-around items-center max-w-6xl w-full p-6">
        <div className="auth-page">
          <div className={`auth-container ${activeForm}`}>
            <div className="auth-form login-form">
              <Login
                toggleForm={() => toggleForm("register")}
                toggleForgotPassword={() => toggleForm("forgotPassword")}
              />
            </div>
            <div className="auth-form register-form">
              <Registration toggleForm={() => toggleForm("login")} />
            </div>
            <div className="auth-form forgot-password-form">
              <ForgotPassword toggleForm={() => toggleForm("login")} />
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 flex items-center justify-center ms-28">
          <img src={Logo} alt="Logo" className="max-w-full h-auto w-34 " />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
