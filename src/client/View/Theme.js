import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
const theme = createMuiTheme({
  breakpoints: {
    unit: "rem",
    values: {
      xs: 0,
      sm: 37.5,
      md: 60,
      lg: 80,
      xl: 120,
    },
  },
});
function Theme(props) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
export default Theme;
