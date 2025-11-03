import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";
import ConnectScale from "../screens/connect-scale";
import MeasurementSelection from "../screens/measurement-selection";
import ManualMeasurement from "../screens/manual-measurement";
import Exercices from "../screens/exercices/Exercices";
import Measures from "../screens/measures";
import Consultations from "../screens/consultations";
import AddConsultation from "../screens/consultations/AddConsultation";
import Weighting from "../screens/weighting";
import ShareMedicalRecords from "../screens/share-medical-records";
import CompanionsScreen from "../screens/companions";
import CompanionDetails from "../screens/companions/CompanionDetails";
import MeasurementDetails from "../screens/measures/MeasurementDetails";
import MeasurementEvents from "../screens/measurement-events";
import AddMeasurementEvent from "../screens/measurement-events/AddMeasurementEvent";
import EventDetails from "../screens/measurement-events/EventDetails";

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="MeasurementSelection" component={MeasurementSelection} />
      <HomeStack.Screen name="ConnectScale" component={ConnectScale} />
      <HomeStack.Screen name="ManualMeasurement" component={ManualMeasurement} />
      <HomeStack.Screen name="Exercices" component={Exercices} />
      <HomeStack.Screen name="Measures" component={Measures} />
      <HomeStack.Screen name="Consultations" component={Consultations} />
      <HomeStack.Screen name="AddConsultation" component={AddConsultation} />
      <HomeStack.Screen name="Weighting" component={Weighting} />
      <HomeStack.Screen name="ShareMedicalRecords" component={ShareMedicalRecords} />
      <HomeStack.Screen name="Companions" component={CompanionsScreen} />
      <HomeStack.Screen name="CompanionDetails" component={CompanionDetails} />
      <HomeStack.Screen name="MeasurementDetails" component={MeasurementDetails} />
    </HomeStack.Navigator>
  );
}

const EventsStack = createNativeStackNavigator();

function EventsStackNavigator() {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MeasurementEvents">
      <EventsStack.Screen name="MeasurementEvents" component={MeasurementEvents} />
      <EventsStack.Screen name="AddMeasurementEvent" component={AddMeasurementEvent} />
      <EventsStack.Screen name="EventDetails" component={EventDetails} />
      <EventsStack.Screen name="MeasurementSelection" component={MeasurementSelection} />
      <EventsStack.Screen name="ConnectScale" component={ConnectScale} />
      <EventsStack.Screen name="ManualMeasurement" component={ManualMeasurement} />
    </EventsStack.Navigator>
  );
}

export { HomeStackNavigator, EventsStackNavigator };
