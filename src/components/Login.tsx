import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LockOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, message } from "antd";
// import Footer from "../components/Footer";
import config from "../config/config";
import { MailOutline } from "@mui/icons-material";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface LoginProps {
  toggleForm: () => void;
  toggleForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ toggleForm, toggleForgotPassword }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    const { email, password, remember } = values;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/login`,
        { email, password, rememberMe: remember },
        { headers: { "Content-Type": "application/json" } },
      );
      // console.log(response.data);

      // Extract the token from the response
      const token = response.data.token.token; // Assuming response.data is an object with a token field

      if (token) {
        // console.log("Token to be stored:", token);
        // Store the token
        if (remember) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        // Set default Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Navigate to dashboard
        navigate("/recipes");
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          "An unexpected error occurred. Please try again.";
        message.error(errorMessage);
      } else {
        console.error("Error during login:", error);
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 ms-8 rounded-3xl shadow-2xl w-full max-w-lg">
      <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
        Sign In
      </h2>
      <Form
        name="login"
        initialValues={{ remember: false }}
        style={{ width: "95%", maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
              type: "email",
            },
          ]}
        >
          <Input
            prefix={<MailOutline className="mr-2" />}
            placeholder="Email"
            size="large"
            className="border rounded-lg p-2 w-full"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="mr-2" />}
            type="password"
            placeholder="Password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            className="border rounded-lg p-2 w-full"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a onClick={toggleForgotPassword} className="text-blue-500">
              Forgot password?
            </a>
          </div>
        </Form.Item>
        <Form.Item>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`relative inline-block px-6 py-2 font-medium group w-40 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span
                className={`absolute inset-0 w-full h-full transition duration-200 ease-out transform bg-black group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-lg ${
                  isLoading
                    ? "translate-x-0 translate-y-0"
                    : "translate-x-1 translate-y-1"
                }`}
              ></span>
              <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black rounded-lg"></span>
              <span className="relative text-black group-hover:text-white flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-black group-hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Login"
                )}
              </span>
            </button>
          </div>
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-400 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-400">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
              or{" "}
            </p>
          </div>
          <div className="flex p-1 justify-center">
            <a
              type="button" // Prevents form submission default behavior
              className="relative inline-flex items-center justify-center p-4 px-8 py-2 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group"
              // onClick={() => navigate("/register")}
              onClick={toggleForm}
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease">
                Register now!
              </span>
              <span className="relative invisible">Register now!</span>
            </a>
          </div>
        </Form.Item>
      </Form>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
