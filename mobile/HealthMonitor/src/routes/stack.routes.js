import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";
import Smartwatch from "../screens/smartwatch";
import Measures from "../screens/measures";

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Smartwatch" component={Smartwatch} />
      <HomeStack.Screen name="Measures" component={Measures} />
    </HomeStack.Navigator>
  );
}

export { HomeStackNavigator };
