import React, { useState } from "react";
import { View } from "react-native";
import Layout from "../../components/layout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddExerciseForm from "./components/AddForm";
import ExercisesChart from "./components/Chart";


const Exercices = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  return (
    <Layout goBackFunction={goBack} title="Exercices">
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ExercisesChart />
          <AddExerciseForm />
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default Exercices;
