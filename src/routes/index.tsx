import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppRoutes } from "./app.routes";
import Toast from "react-native-toast-message";
import { TopMessage } from "../components/top-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Routes = () => {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <AppRoutes />

      <Toast
        config={{
          info: ({ text1 }) => <TopMessage title={String(text1)} />,
        }}
        topOffset={insets.top} // distancia do top
      />
    </NavigationContainer>
  );
};

/**
 * EXPORT
 */
export { Routes };
