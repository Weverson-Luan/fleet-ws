/**
 * IMPORTS
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import { Departure } from "../screen/departure";
import { Arrival } from "../screen/arrival";
import { Home } from "../screen/home";

const { Navigator, Screen } = createNativeStackNavigator();

export const AppRoutes = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={Home} />
      <Screen name="departure" component={Departure} />
      <Screen name="arrival" component={Arrival} />
    </Navigator>
  );
};
