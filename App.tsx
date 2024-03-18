import React from "react";
import { ThemeProvider } from "styled-components";
import { StatusBar } from "react-native";

import { SignIn } from "./src/screens/signin";

import theme from "./src/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={"light-content"} translucent />
      <SignIn />
    </ThemeProvider>
  );
}
