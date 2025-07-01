import type { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaBriefcase } from "react-icons/fa";

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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

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

const SignupButton = styled.button`
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

const SignupPage: FC = () => {
  return (
    <PageContainer>
      <SignupCard>
        <CardHeader>
          <h1>Create Account</h1>
          <p>Start tracking your job applications today</p>
        </CardHeader>

        <form>
          <FormGroup>
            <label>Full Name</label>
            <InputWrapper>
              <FaUser />
              <Input type="text" placeholder="Enter your full name" />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Email Address</label>
            <InputWrapper>
              <FaEnvelope />
              <Input type="email" placeholder="Enter your email" />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Password</label>
            <InputWrapper>
              <FaLock />
              <Input type="password" placeholder="Choose a password" />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Confirm Password</label>
            <InputWrapper>
              <FaLock />
              <Input type="password" placeholder="Confirm your password" />
            </InputWrapper>
          </FormGroup>

          <SignupButton type="submit">
            <span>Create Account</span>
          </SignupButton>
        </form>

        <Footer>
          Already have an account?
          <Link to="/login">Sign In</Link>
        </Footer>
      </SignupCard>
    </PageContainer>
  );
};

export default SignupPage;
