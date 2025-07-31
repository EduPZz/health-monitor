import React, { useContext, useState, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabRoutes from "./tab.routes";
import Register from "../screens/register/Register";
import Login from "../screens/signin/Login";
import { Context } from "../context/authContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShareMedicalRecords from "../screens/share-medical-records";
import CompanionsScreen from "../screens/companions";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Routes() {
  const Stack = createNativeStackNavigator();
  const insets = useSafeAreaInsets();
  const { isLogged, state } = useContext(Context);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const logged = await isLogged();
      setLoggedIn(logged);
    };
    checkLoginStatus();
  }, [isLogged, state.isAuthenticated]);

  if (loggedIn === null) return <Text>Loading...</Text>;

  return (
    <NavigationContainer>
      {loggedIn ? (
        <>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="TabRoutes"
          >
            <Stack.Screen name="TabRoutes" component={TabRoutes} />
            <Stack.Screen
              name="ShareMedicalRecords"
              component={ShareMedicalRecords}
            />
            <Stack.Screen
              name="Companions"
              component={CompanionsScreen}
            />
          </Stack.Navigator>
          <Toast topOffset={insets.top} />
        </>
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
