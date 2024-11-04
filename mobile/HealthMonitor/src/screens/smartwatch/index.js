import React from "react";
import Layout from "../../components/layout";
import { Text } from "react-native";

const Smartwatch = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  return (
    <Layout goBackFunction={goBack} title={'Smartwatch'}>
      <Text>
        Ola!
      </Text>
    </Layout>
  );
};

export default Smartwatch;
