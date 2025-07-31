import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import Routes from "./src/routes";
import { Provider } from "./src/context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_300Light_Italic, Inter_100Thin, Inter_100Thin_Italic, Inter_200ExtraLight } from '@expo-google-fonts/inter';
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_100Thin_Italic,
    Inter_200ExtraLight,
    Inter_200ExtraLight,
    Inter_400Regular,
    Inter_700Bold,
    Inter_300Light_Italic
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
