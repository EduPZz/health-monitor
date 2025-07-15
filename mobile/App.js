import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import Routes from "./src/routes";
import { Provider } from "./src/context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_100Thin_Italic,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_100Thin_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return <Routes />;
};

export default () => {
  return (
    <TamaguiProvider config={config}>
      <Provider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <App />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </Provider>
    </TamaguiProvider>
  );
};
