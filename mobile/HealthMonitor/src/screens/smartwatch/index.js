import React, { useState } from "react";
import Layout from "../../components/layout";
import Icons from "../../components/Icons";
import styles from './styles'
import { Text, View, TouchableOpacity, TextInput } from "react-native";

const Smartwatch = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  const [watchCode, setWatchCode] = useState('');

  const handlePairing = () => {
    console.log('Emparelhando com o código:', watchCode);
  };

  return (
    <Layout goBackFunction={goBack} title={'Smartwatch'}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>Insira o código do seu smartwatch para conectá-lo.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código do relógio"
            placeholderTextColor="#A5A5A5"
            value={watchCode}
            onChangeText={setWatchCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handlePairing}>
            <Icons.MaterialCommunityIcons name="watch" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

      </View>
    </Layout>
  );
};

export default Smartwatch;
