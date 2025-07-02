import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../api/config";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%);
`;

const SignupCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 0.75rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.7;
    transition: all 0.2s ease;
  }

  &:focus-within {
    svg {
      color: ${({ theme }) => theme.colors.primary};
      opacity: 1;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}25`};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const PasswordInputWrapper = styled(InputWrapper)`
  svg.toggle-password {
    left: auto;
    right: 1rem;
    cursor: pointer;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  transform: translateZ(0);
  margin-top: 1rem;

  span {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  &:hover {
    transform: scale(1.02) translateZ(0);
    box-shadow: 0 4px 15px ${({ theme }) => `${theme.colors.primary}40`};

    &::before {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.98) translateZ(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.error}15;
  border-radius: 8px;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textLight};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.username.length < 3 || formData.username.length > 50) {
      setError("Username must be between 3 and 50 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending request to backend:", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      const response = await api.post("/api/auth/signup", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      console.log("Response received:", response);

      if (response.status === 200 || response.status === 201) {
        // Redirect to login page after successful signup
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.detail || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <SignupCard>
        <CardHeader>
          <h1>Create Account</h1>
          <p>Start tracking your job applications today</p>
        </CardHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <InputWrapper>
              <FaEnvelope />
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="off"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label htmlFor="username">Username</label>
            <InputWrapper>
              <FaUser />
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="off"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">Password</label>
            <PasswordInputWrapper>
              <FaLock />
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
              />
              {showPassword ? (
                <FaEyeSlash
                  className="toggle-password"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEye
                  className="toggle-password"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </PasswordInputWrapper>
          </FormGroup>

          <FormGroup>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <PasswordInputWrapper>
              <FaLock />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {showConfirmPassword ? (
                <FaEyeSlash
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <FaEye
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </PasswordInputWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
          </SubmitButton>
        </Form>

        <Footer>
          Already have an account?
          <Link to="/login">Sign In</Link>
        </Footer>
      </SignupCard>
    </PageContainer>
  );
};

export default SignupPage;
