import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";
import ConnectScale from "../screens/connect-scale";
import Exercices from "../screens/exercices/Exercices";
import Measures from "../screens/measures";
import Consultations from "../screens/consultations";
import Weighting from "../screens/weighting";
import ShareMedicalRecords from "../screens/share-medical-records";
import CompanionsScreen from "../screens/companions";
import CompanionDetails from "../screens/companions/CompanionDetails";
import MeasurementDetails from "../screens/measures/MeasurementDetails";

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="ConnectScale" component={ConnectScale} />
      <HomeStack.Screen name="Exercices" component={Exercices} />
      <HomeStack.Screen name="Measures" component={Measures} />
      <HomeStack.Screen name="Consultations" component={Consultations} />
      <HomeStack.Screen name="Weighting" component={Weighting} />
      <HomeStack.Screen name="ShareMedicalRecords" component={ShareMedicalRecords} />
      <HomeStack.Screen name="Companions" component={CompanionsScreen} />
      <HomeStack.Screen name="CompanionDetails" component={CompanionDetails} />
      <HomeStack.Screen name="MeasurementDetails" component={MeasurementDetails} />
    </HomeStack.Navigator>
  );
}

export { HomeStackNavigator };
