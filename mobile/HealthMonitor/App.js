import Routes from "./src/routes";

import { Provider } from "./src/context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  return <Routes />;
};

export default () => {
  return (
    <Provider>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </Provider>
  );
};
