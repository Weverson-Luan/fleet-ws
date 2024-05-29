import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppRoutes } from "./app.routes";

const Routes = () => {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
};

/**
 * EXPORT
 */
export { Routes };
