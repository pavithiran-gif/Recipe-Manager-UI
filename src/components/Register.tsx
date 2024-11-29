import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { MailOutline } from "@mui/icons-material";
import axios from "axios";
import config from "../config/config";
import { HowToReg } from "@mui/icons-material";
import type { GetProps } from "antd";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import LockIcon from "@mui/icons-material/Lock";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface RegistrationProps {
  toggleForm: () => void;
}

type OTPProps = GetProps<typeof Input.OTP>;

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[\W_]/.test(password)) score += 1;

  return score;
};

const getStrengthLabel = (score: number) => {
  switch (score) {
    case 0:
      return "None";
    case 1:
      return "Weak";
    case 2:
      return "Moderate";
    case 3:
      return "Strong";
    case 4:
      return "Perfect";
    default:
      return "Unknown";
  }
};

const Registration: React.FC<RegistrationProps> = ({ toggleForm }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  // const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  // const [alert, setAlert] = useState<{
  //   severity: "success" | "info" | "warning" | "error";
  //   title: string;
  //   message: string;
  //   autoClose?: boolean; // Optional autoClose field
  //   onClose?: () => void; // Optional onClose callback
  // } | null>(null);

  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  useEffect(() => {
    if (step === 2) {
      startTimer();
    }
  }, [step]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  useEffect(() => {
    // Compare passwords whenever password or confirmPassword changes
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null); // Indeterminate if either field is empty
    }
  }, [password, confirmPassword]);

  const startTimer = () => {
    setTimer(120); // 2 minutes countdown
  };

  // const onFinishStep1 = async (values: { email: string }) => {
  //   setEmail(values.email);
  //   try {
  //     const response = await axios.post(
  //       `${config.apiUrl}/api/send-otp`,
  //       { email: values.email },
  //       { headers: { "Content-Type": "application/json" } },
  //     );

  //     if (response.data.success) {
  //       setOtpSent(true);
  //       message.success("OTP sent to your email!");
  //       setStep(2);
  //     } else {
  //       message.error(
  //         response.data.message ||
  //           "An unexpected error occurred. Please try again.",
  //       );
  //     }
  //   } catch (error) {
  //     message.error("An unexpected error occurred. Please try again.");
  //   }
  // };

  const onFinishStep1 = async (values: { email: string }) => {
    setEmail(values.email);
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/send-otp`,
        { email: values.email },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        // setOtpSent(true);
        message.success("OTP sent to your email!");
        setStep(2);
      } else {
        message.error(
          response.data.message ||
            "An unexpected error occurred. Please try again.",
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else {
          message.error("An unexpected error occurred. Please try again.");
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const resendOTP = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/send-otp`,
        { email },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        message.success("OTP resent to your email!");
        startTimer();
      } else {
        message.error(
          response.data.message ||
            "An unexpected error occurred. Please try again.",
        );
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const onFinishStep2 = async (values: { otp: string }) => {
    setOtp(values.otp);
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/verify-otp`,
        { email, otp: values.otp },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        message.success("OTP verified!");
        setStep(3);
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const onFinishStep3 = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/register`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const { data } = response;

      if (response.status === 201) {
        message.success(data.message);
        // if (response.data.success) {
        //   message.success("Registration successful!");
        // toggleForm(); // Call toggleForm to switch to the login form
        setTimeout(() => {
          toggleForm(); // Call toggleForm to switch to the login form
          setStep(1);
        }, 2000); // Optional: Add a delay if you want to show the success message before switching
      } else {
        // message.error("An unexpected error occurred. Please try again.");
        message.error(
          response.data.message ||
            "An unexpected error occurred. Please try again.",
        );
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const editEmail = () => {
    setStep(1);
    // setOtpSent(false);
  };

  const passwordStrengthScore = getPasswordStrength(password);
  const passwordStrengthLabel = getStrengthLabel(passwordStrengthScore);
  const isPasswordValid =
    passwordStrengthScore >= 3 && password === confirmPassword;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-2xl md:max-w-sm mx-auto">
      {step === 1 && (
        <Form
          name="register-step1"
          initialValues={{ email }}
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep1}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <HowToReg fontSize="large" className="text-8xl text-gray-800" />{" "}
            Register
          </h2>
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
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-gray w-full"
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 2 && (
        <Form
          name="register-step2"
          initialValues={{ otp }}
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep2}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <MarkEmailReadIcon
              fontSize="large"
              className="text-2xl text-gray-800"
            />{" "}
            Email Verification
          </h2>
          <p className="text-gray-500 text-sm ">
            The OTP is sent to your email
          </p>
          <div className="flex items-center justify-between mb-4">
            <span>{email}</span>
            <Button type="link" onClick={editEmail}>
              Edit
            </Button>
          </div>
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please input the OTP!" },
              { len: 6, message: "OTP should be 6 digits!" },
            ]}
          >
            <Input.OTP variant="filled" {...sharedProps} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-gray-700  w-full"
            >
              Verify OTP
            </Button>
          </Form.Item>
          <div className="mt-4">
            <Button
              type="link"
              onClick={resendOTP}
              disabled={timer > 0}
              className="p-0"
            >
              Resend OTP {timer > 0 && `in ${timer}s`}
            </Button>
          </div>
        </Form>
      )}

      {step === 3 && (
        <Form
          name="register-step3"
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep3}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <LockIcon fontSize="large" className="text-gray-800" /> Set Password
          </h2>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="mr-2" />}
              type="password"
              placeholder="Password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              size="large"
              className="border rounded-lg p-2 w-full"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              // onChange={(e) => setPassword(e.target.value)}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowConfirmPassword(false);
              }}
            />
          </Form.Item>
          <div className="w-full mb-4">
            <p className="text-gray-500 mb-2">
              Password Strength: {passwordStrengthLabel}
            </p>
            <Progress
              percent={(getPasswordStrength(password) / 4) * 100}
              strokeColor={
                passwordStrengthLabel === "Weak"
                  ? "#ff4d4f"
                  : passwordStrengthLabel === "Moderate"
                  ? "#ffa940"
                  : "#52c41a"
              }
              showInfo={false}
            />
          </div>
          {/* <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your Password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="mr-2" />}
              type="password"
              placeholder="Confirm Password"
              visibilityToggle={{
                visible: conpasswordVisible,
                onVisibleChange: setconPasswordVisible,
              }}
              size="large"
              className="border rounded-lg p-2 w-full"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
          <div className="w-full mb-4">
            <p
              className={`text-${
                passwordMatch === true
                  ? "green"
                  : passwordMatch === false
                  ? "red"
                  : "gray"
              }-500`}
            >
              {passwordMatch === true
                ? "Passwords match!"
                : passwordMatch === false
                ? "Passwords do not match!"
                : "Confirm password"}
            </p>
          </div>
          <Form.Item> */}
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your Password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="mr-2" />}
              type="password"
              placeholder="Confirm Password"
              visibilityToggle={{
                visible: showConfirmPassword,
                onVisibleChange: setShowConfirmPassword,
              }}
              size="large"
              className="border rounded-lg p-2 w-full"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
          <div className="w-full mb-4 flex items-center">
            {passwordMatch === true ? (
              <CheckCircleOutlined className="text-green-500 mr-2" />
            ) : passwordMatch === false ? (
              <CloseCircleOutlined className="text-red-500 mr-2" />
            ) : null}
            <p
              className={`text-${
                passwordMatch === true
                  ? "green"
                  : passwordMatch === false
                  ? "red"
                  : "gray"
              }-500`}
            >
              {passwordMatch === true
                ? "Passwords match!"
                : passwordMatch === false
                ? "Passwords do not match!"
                : ""}
            </p>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full cursor-pointer"
              disabled={!isPasswordValid}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      )}

      <div className="mt-4">
        <span>Already registered? </span>
        <a onClick={toggleForm} className="text-blue-500 cursor-pointer">
          Login
        </a>
      </div>
    </div>
  );
};

export default Registration;
