import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Calculator from "../screens/calculator";
import Icon from "react-native-vector-icons/Ionicons";
import { HomeStackNavigator } from "./stack.routes";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#282828'
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: '',
        }}
      />

      <Tab.Screen
        name="Calculator"
        component={Calculator}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Icon
              name={focused ? "calculator" : "calculator-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: '',
        }}
      />
    </Tab.Navigator>
  );
}
