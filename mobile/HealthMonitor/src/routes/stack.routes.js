import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";
import Smartwatch from "../screens/smartwatch";
import Measures from "../screens/measures";
import Consultations from "../screens/consultations";

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Smartwatch" component={Smartwatch} />
      <HomeStack.Screen name="Measures" component={Measures} />
      <HomeStack.Screen name="Consultations" component={Consultations} />
    </HomeStack.Navigator>
  );
}

export { HomeStackNavigator };
