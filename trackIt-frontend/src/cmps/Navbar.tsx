import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  styled,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import { HowToUseModal } from "./HowToUseModal";
import {
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaUser,
  FaBriefcase,
} from "react-icons/fa";

// Navbar container with brand purple background
const StyledAppBar = styled(AppBar)(() => ({
  background: "#4F46E5",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderBottom: "2px solid #6366F1",
  position: "sticky",
  top: 0,
  zIndex: 1100,
}));

// Toolbar with proper height and padding
const StyledToolbar = styled(Toolbar)(() => ({
  height: "64px",
  padding: "0 24px",
  "@media (max-width: 768px)": {
    padding: "0 16px",
  },
}));

// Brand logo with white text and optional icon
const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled(FaBriefcase)`
  font-size: 20px;
  color: #ffffff;
`;

const LogoText = styled("div")`
  font-weight: 700;
  font-size: 24px;
  color: #ffffff;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const LogoLink = styled(RouterLink)`
  text-decoration: none;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  min-height: 44px;
  min-width: 44px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

// Navigation section with proper spacing
const NavSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Navigation links with white text and hover states
const NavLink = styled(RouterLink)`
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 12px;
  min-height: 44px;
  min-width: 44px;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 3px;
      background: #ffffff;
      border-radius: 2px;
    }
  }
`;

// How to use button with white styling
const HowToUseButton = styled("button")`
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  min-height: 44px;
  min-width: 44px;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  &:active {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(0);
  }
`;

const QuestionIcon = styled(FaQuestionCircle)`
  font-size: 16px;
  color: #ffffff;
`;

// User section aligned to the right
const UserSection = styled(Box)`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Vertical divider with white styling
const VerticalDivider = styled(Box)`
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 16px;
`;

// User container with white styling
const UserContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

// User avatar with white border
const UserAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
`;

// User greeting text in white
const UserGreeting = styled(Typography)`
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Username = styled("span")`
  font-weight: 600;
  color: #ffffff;
`;

// Logout button with white styling
const LogoutButton = styled("button")`
  color: rgba(255, 255, 255, 0.8);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

// Mobile menu button with white styling
const MobileMenuButton = styled(IconButton)`
  display: none;
  color: #ffffff;
  padding: 8px;
  min-height: 44px;
  min-width: 44px;
  border-radius: 8px;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

// Mobile drawer with brand purple styling
const MobileDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 300px;
    padding: 24px 16px;
    background: #4f46e5;
    border-left: 2px solid #6366f1;
  }
`;

// Mobile menu header
const MobileMenuHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const MobileMenuTitle = styled(Typography)`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

// Mobile menu item with white styling
const MobileMenuItem = styled(ListItem)`
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  min-height: 44px;
  transition: all 0.2s ease;
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }

  &:active {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const MobileMenuItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    color: #ffffff;
    font-size: 17px;
    font-weight: 500;
  }
`;

// Mobile user section
const MobileUserSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const Navbar = (): JSX.Element => {
  const { isAuthenticated, logout, user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleHowToUse = () => {
    setIsHowToUseOpen(true);
    setIsMobileMenuOpen(false);
  };

  const displayName = isGuest
    ? "Guest"
    : capitalizeFirstLetter(user?.username || "User");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const mobileMenuItems = [
    {
      text: "How To Use",
      onClick: handleHowToUse,
      icon: <FaQuestionCircle />,
    },
    ...(isAuthenticated
      ? [
          {
            text: "Logout",
            onClick: handleLogout,
          },
        ]
      : [
          {
            text: "Login",
            onClick: () => {
              navigate("/login");
              setIsMobileMenuOpen(false);
            },
          },
          {
            text: "Sign Up",
            onClick: () => {
              navigate("/signup");
              setIsMobileMenuOpen(false);
            },
          },
        ]),
  ];

  return (
    <>
      <StyledAppBar position="sticky">
        <StyledToolbar disableGutters>
          {/* Logo with icon */}
          <LogoLink to="/">
            <LogoContainer>
              <LogoIcon />
              <LogoText>TrackIt</LogoText>
            </LogoContainer>
          </LogoLink>

          {/* Desktop Navigation */}
          <NavSection>
            <HowToUseButton onClick={handleHowToUse}>
              <QuestionIcon />
              How To Use
            </HowToUseButton>
          </NavSection>

          {/* Desktop User Section */}
          <UserSection>
            {isAuthenticated ? (
              <>
                <UserContainer>
                  <UserAvatar>{getInitials(displayName)}</UserAvatar>
                  <UserGreeting>
                    Hey, <Username>{displayName}</Username>
                  </UserGreeting>
                </UserContainer>
                <VerticalDivider />
                <LogoutButton onClick={handleLogout}>logout</LogoutButton>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </UserSection>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </MobileMenuButton>
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Menu Drawer */}
      <MobileDrawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <MobileMenuHeader>
          <MobileMenuTitle>Menu</MobileMenuTitle>
          <IconButton
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            sx={{
              color: "#FFFFFF",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <FaTimes />
          </IconButton>
        </MobileMenuHeader>

        <List>
          {mobileMenuItems.map((item, index) => (
            <MobileMenuItem key={index} onClick={item.onClick}>
              <MobileMenuItemText primary={item.text} />
            </MobileMenuItem>
          ))}
        </List>

        {/* Mobile User Section */}
        {isAuthenticated && (
          <MobileUserSection>
            <UserAvatar>{getInitials(displayName)}</UserAvatar>
            <UserGreeting>
              Hey, <Username>{displayName}</Username>
            </UserGreeting>
          </MobileUserSection>
        )}
      </MobileDrawer>

      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />
    </>
  );
};

export default Navbar;
