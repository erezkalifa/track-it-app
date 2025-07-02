import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, ${({ theme }) =>
      theme.colors.backgroundStart} 0%, ${({ theme }) =>
  theme.colors.backgroundEnd} 100%);
    color: ${({ theme }) => theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                 "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(
        45deg,
        transparent 45%,
        rgba(99, 102, 241, 0.03) 45%,
        rgba(99, 102, 241, 0.03) 55%,
        transparent 55%
      );
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }

  #root {
    min-height: 100vh;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
`;
