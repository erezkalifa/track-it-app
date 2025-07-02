import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      backgroundStart: string;
      backgroundEnd: string;
      background: string;
      text: string;
      textLight: string;
      primary: string;
      primaryDark: string;
      secondary: string;
      secondaryDark: string;
      danger: string;
      error: string;
      success: string;
      info: string;
      border: string;
      status: {
        draft: string;
        applied: string;
        interview: string;
        offer: string;
        rejected: string;
        withdrawn: string;
        pending: string;
      };
    };
    gradients: {
      background: string;
      button: string;
    };
  }
}
