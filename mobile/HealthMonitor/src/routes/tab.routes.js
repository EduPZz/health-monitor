import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Calculator from "../screens/calculator";
import Icons from "../components/Icons";
import { HomeStackNavigator } from "./stack.routes";
import Home from "../screens/home";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 100 },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#282828'
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Icons.Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: '',
        }}
      />

      <Tab.Screen 
        name="options"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: () => (
            <Icons.FontAwesome6
              name="circle-plus"
              size={50}
              color={"#F5B041"}
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
            <Icons.Ionicons
              name={focused ? "person" : "person-outline"}
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
