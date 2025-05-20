import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Icons from "../../components/Icons";
import styles from "./styles";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import SmartwatchCards from "../../components/SmartWatchCard";
import api from "../../api";

const Smartwatch = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  return (
    <Layout goBackFunction={goBack} title={"Conectar dispositivo"}>
      <View style={styles.container}>
      </View>
    </Layout>
  );
};

export default Smartwatch;
