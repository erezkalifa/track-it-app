import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      backgroundStart: string;
      backgroundEnd: string;
      text: string;
      textLight: string;
      primary: string;
      danger: string;
      status: {
        draft: string;
        applied: string;
        interview: string;
        offer: string;
        rejected: string;
        withdrawn: string;
      };
    };
    gradients: {
      background: string;
      button: string;
    };
  }
}
