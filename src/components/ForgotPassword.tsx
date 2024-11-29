import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { MailOutline } from "@mui/icons-material";
import axios from "axios";
import config from "../config/config";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import LockIcon from "@mui/icons-material/Lock";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ForgotPasswordProps {
  toggleForm: () => void;
}

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

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ toggleForm }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  // const [passwordVisible, setPasswordVisible] = React.useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

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
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  const startTimer = () => {
    setTimer(120);
  };

  const onFinishStep1 = async (values: { email: string }) => {
    setEmail(values.email);
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/forgot-pass-otp`,
        { email: values.email },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        // setOtpSent(true);
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
        `${config.apiUrl}/api/forgot-pass-otp`,
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
    } catch {
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
    } catch {
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
        `${config.apiUrl}/api/reset-password`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const { data } = response;

      if (response.status === 200) {
        message.success(data.message);
        if (toggleForm) {
          setTimeout(() => {
            toggleForm(); // Only call toggleForm if it exists
            setStep(1);
          }, 2000);
        }
      } else {
        message.error(
          response.data.message ||
            "An unexpected error occurred. Please try again.",
        );
      }
    } catch {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const editEmail = () => {
    setStep(1);
    // setOtpSent(false);
  };

  const handleBackToLogin = () => {
    toggleForm();
  };

  const passwordStrengthScore = getPasswordStrength(password);
  const passwordStrengthLabel = getStrengthLabel(passwordStrengthScore);
  const isPasswordValid =
    passwordStrengthScore >= 3 && password === confirmPassword;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-2xl md:max-w-sm mx-auto">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackToLogin}
        className="self-start mb-4"
      >
        Back to Login
      </Button>
      {step === 1 && (
        <Form
          name="forgot-password-step1"
          initialValues={{ email }}
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep1}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <LockOutlined
              style={{ fontSize: "25px" }}
              className="text-8xl text-gray-800"
            />{" "}
            Forgot Password
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
          name="forgot-password-step2"
          initialValues={{ otp }}
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep2}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <MarkEmailReadIcon
              fontSize="large"
              className="text-2xl text-gray-800"
            />{" "}
            Verify Email
          </h2>
          <p className="text-gray-500 text-sm">The OTP is sent to your email</p>
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
              { len: 6, message: "OTP should be 6 digits long!" },
            ]}
          >
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
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
          <div className="flex items-center justify-between">
            {timer > 0 ? (
              <span className="text-gray-500 text-sm">
                Resend OTP in {timer} seconds
              </span>
            ) : (
              <Button type="link" onClick={resendOTP}>
                Resend OTP
              </Button>
            )}
          </div>
        </Form>
      )}

      {step === 3 && (
        <Form
          name="forgot-password-step3"
          initialValues={{ password, confirmPassword }}
          style={{ width: "85%", maxWidth: 360 }}
          onFinish={onFinishStep3}
        >
          <h2 className="text-2xl text-center p-2 font-bold text-gray-800 mb-6">
            <LockIcon fontSize="medium" className="text-2xl text-gray-800" />{" "}
            Reset Password
          </h2>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
              className="border rounded-lg p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Progress
              percent={passwordStrengthScore * 25}
              showInfo={false}
              status={passwordStrengthScore >= 3 ? "success" : "exception"}
            />
            <span className="text-gray-500 text-sm">
              Strength: {passwordStrengthLabel}
            </span>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm New Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
              className="border rounded-lg p-2 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          {passwordMatch === false && (
            <span className="text-red-500 text-sm">
              Passwords do not match!
            </span>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black hover:bg-gray-700 w-full"
              disabled={!isPasswordValid}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
