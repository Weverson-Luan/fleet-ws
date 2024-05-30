/**
 * IMPORTS
 */
import "react-native-get-random-values";
import "./src/libs/dayjs";

import { StatusBar } from "react-native";
import { AppProvider, UserProvider } from "@realm/react";

import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useNetInfo } from "@react-native-community/netinfo";

import theme from "./src/theme";

import { SignIn } from "./src/screen/signin";

import { Loading } from "./src/components/loading";

import { REALM_APP_ID } from "@env";
import { Routes } from "./src/routes";
import { RealmProvider, syncConfig } from "./src/libs/realm";
import { TopMessage } from "./src/components/top-message";
import { WifiSlash } from "phosphor-react-native";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const { isConnected } = useNetInfo();

  if (!fontsLoaded) {
    return <Loading />;
  }
  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />
          {!isConnected && (
            <TopMessage title="Você está off-line" icon={WifiSlash} />
          )}

          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
