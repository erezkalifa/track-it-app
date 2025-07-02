import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  styled,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import { HowToUseModal } from "./HowToUseModal";

const StyledAppBar = styled(AppBar)(() => ({
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
}));

const StyledToolbar = styled(Toolbar)(() => ({
  padding: "0.75rem 0",
  "@media (min-width: 600px)": {
    padding: "0.75rem 0",
  },
}));

const LogoText = styled("div")`
  font-weight: 700;
  font-size: 2rem;
  color: #6366f1;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
`;

const LogoLink = styled(RouterLink)`
  text-decoration: none;
  padding: 0.25rem 0;
`;

const LogoSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

const HowToUseButton = styled("button")`
  color: rgba(99, 102, 241, 0.8);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #6366f1;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #6366f1;

    &::after {
      width: 100%;
    }
  }
`;

const NavLink = styled(RouterLink)`
  color: rgba(99, 102, 241, 0.8);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;

  &:hover {
    color: #6366f1;
  }
`;

const NavButtonsContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginLeft: "auto",
}));

const UserContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 2rem;
  padding: 0.5rem 0;
`;

const UserGreeting = styled(Typography)`
  color: #7c3aed;
  font-size: 0.9375rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const Username = styled("span")`
  font-weight: 500;
  color: #7c3aed;
  margin: 0 1px;
`;

const LogoutButton = styled("span")`
  color: rgba(139, 92, 246, 0.8);
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s ease;
  margin-left: 0;
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    color: #8b5cf6;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
  }
`;

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = isGuest
    ? "Guest"
    : capitalizeFirstLetter(user?.username || "User");

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="lg">
          <StyledToolbar disableGutters>
            <LogoSection>
              <LogoLink to="/">
                <LogoText>TrackIt</LogoText>
              </LogoLink>
              <HowToUseButton onClick={() => setIsHowToUseOpen(true)}>
                How To Use
              </HowToUseButton>
            </LogoSection>

            <NavButtonsContainer>
              {isAuthenticated ? (
                <UserContainer>
                  <UserGreeting>
                    Hey, <Username>{displayName}</Username>
                    <LogoutButton onClick={handleLogout}>(logout)</LogoutButton>
                  </UserGreeting>
                </UserContainer>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </>
              )}
            </NavButtonsContainer>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />
    </>
  );
};

export default Navbar;
