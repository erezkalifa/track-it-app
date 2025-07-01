import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  styled,
  Container,
} from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  font-size: 1.5rem;
  color: #6366f1;
  letter-spacing: 0.5px;
`;

const LogoLink = styled(RouterLink)`
  text-decoration: none;
  margin-right: auto;
`;

const NavButton = styled(Button)<ButtonProps & Partial<LinkProps>>(() => ({
  color: "rgba(99, 102, 241, 0.9)",
  fontSize: "0.9375rem",
  fontWeight: 500,
  padding: "0.5rem 1.25rem",
  marginLeft: "0.5rem",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  textTransform: "none",
  "&:hover": {
    color: "#6366f1",
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const NavLink = styled(RouterLink)`
  color: rgba(99, 102, 241, 0.9);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`;

const NavButtonsContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <StyledToolbar disableGutters>
          <LogoLink to="/">
            <LogoText>TrackIt</LogoText>
          </LogoLink>
          <NavButtonsContainer>
            {isAuthenticated ? (
              <>
                <NavButton component={RouterLink} to="/jobs">
                  My Applications
                </NavButton>
                <NavLink to="/" onClick={handleLogout}>
                  Logout
                </NavLink>
              </>
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
  );
};

export default Navbar;
