import React, { useCallback, useMemo, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Calculator from "../screens/calculator";
import Icons from "../components/Icons";
import { HomeStackNavigator } from "./stack.routes";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SvgIcon } from "../icons/SvgIcons";

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

export default function TabRoutes() {
  const bottomSheetRef = useRef(null);

  // const handleSheetChanges = useCallback((index) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const handleOpenSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { height: 75 },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#282828",
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ focused, size, color }) => (
              <SvgIcon
                name="home"
                outline={!focused}
                size={size}
                color="#000"
              />
            ),
            tabBarLabel: "",
          }}
        />

        <Tab.Screen
          name="options"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size }) => (
              <Icons.FontAwesome6
                name="circle-plus"
                size={size}
                color={"#1976D2"}
              />
            ),
            tabBarLabel: "",
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={handleOpenSheet}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icons.FontAwesome6
                  name="circle-plus"
                  size={30}
                  color={"#1976D2"}
                />
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Calculator"
          component={Calculator}
          options={{
            tabBarIcon: ({ focused, size, color }) => (
              <SvgIcon
                name="person"
                size={size}
                color={color}
                outline={!focused}
              />
            ),
            tabBarLabel: "",
          }}
        />
      </Tab.Navigator>

      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        // onChange={handleSheetChanges}
        snapPoints={["30%", "60%"]}
        index={-1}
      >
        <BottomSheetView style={styles.container}>
          <TouchableOpacity style={styles.optContainer} onPress={() => {}}>
            <View style={styles.firstOptContainer}>
              <Icons.FontAwesome6
                name="weight-scale"
                size={24}
                color={"#000"}
              />
              <Text style={styles.textOpt}>Pesagem</Text>
            </View>
            <Icons.FontAwesome6 name="chevron-right" size={16} color={"#000"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optContainer}
            onPress={() => {
              bottomSheetRef.current?.close();
              navigation.navigate("ShareMedicalRecords");
            }}
          >
            <View style={styles.firstOptContainer}>
              <Icons.FontAwesome6
                name="file-medical"
                size={24}
                color={"#000"}
              />
              <Text style={styles.textOpt}>Compartilhar</Text>
            </View>
            <Icons.FontAwesome6 name="chevron-right" size={16} color={"#000"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optContainer}
            onPress={() => {
              bottomSheetRef.current?.close();
              navigation.navigate("Companions");
            }}
          >
            <View style={styles.firstOptContainer}>
              <Icons.Ionicons name="people" size={24} color={"#000"} />
              <Text style={styles.textOpt}>Meus Acompanhados</Text>
            </View>
            <Icons.FontAwesome6 name="chevron-right" size={16} color={"#000"} />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  optContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  firstOptContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textOpt: {
    paddingLeft: 20,
    fontSize: 16,
  },
});
