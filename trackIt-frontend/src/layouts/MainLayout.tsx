import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../cmps/Navbar";

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.backgroundStart} 0%,
    ${({ theme }) => theme.colors.backgroundEnd} 100%
  );
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;

  /* Responsive padding */
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const MainLayout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
