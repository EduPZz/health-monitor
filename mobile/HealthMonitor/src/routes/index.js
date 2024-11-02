import React, { useContext, useState, useEffect } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabRoutes from "./tab.routes";
import Register from "../screens/register/Register";
import Login from "../screens/signin/Login";
import { Context } from "../context/authContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function Routes() {
  const Stack = createNativeStackNavigator();
  const { isLogged } = useContext(Context);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const logged = await isLogged();
      setLoggedIn(logged);
    };
    checkLoginStatus();
  }, [isLogged]);

  if (loggedIn === null) return <Text>Loading...</Text>;

  return (
    <NavigationContainer>
      {false ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabRoutes" component={TabRoutes} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="TabRoutes" component={TabRoutes} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
