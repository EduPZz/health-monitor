import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/home";
import Calculator from "../screens/calculator";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 60 } }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarLabel: '',
        }}
      />

      <Tab.Screen
        name="Calculator"
        component={Calculator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon name="calculator" size={size} color={color} />
          ),
          tabBarLabel: '',
        }}
      />
    </Tab.Navigator>
  );
}
