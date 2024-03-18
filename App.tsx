import React from "react";
import { ThemeProvider } from "styled-components";
import { Text, View } from "react-native";
import theme from "./src/theme";
import { SignIn } from "./src/screens/signin";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SignIn />
    </ThemeProvider>
  );
}
