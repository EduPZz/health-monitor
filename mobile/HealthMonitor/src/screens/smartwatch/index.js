import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Icons from "../../components/Icons";
import styles from './styles';
import { Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import SmartwatchCards from "../../components/SmartWatchCard";
import api from "../../api";

const Smartwatch = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  const [watchCode, setWatchCode] = useState('');
  const [smartwatch, setSmartwatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchCode = async () => {
      try {
        const { data: { smartwatchCode } } = await api.get('auth/profile');
        setWatchCode(smartwatchCode ?? "");

        if (smartwatchCode) handlePairing(smartwatchCode ?? "", true);
      } catch (error) {
        console.error("Erro ao buscar o código do smartwatch:", error);
        Alert.alert("Erro", "Não foi possível buscar o código do smartwatch.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchCode();
  }, []);

  useEffect(() => {
    let interval;

    if (smartwatch && watchCode) {
      interval = setInterval(() => {
        handlePairing(watchCode, false);
      }, 10000); // Call every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval); // Clear interval on unmount or dependency change
    };
  }, [smartwatch, watchCode]);

  const handlePairing = async (watchCode, shouldShowLoading) => {
    try {
      if (shouldShowLoading) setLoading(true);
      const { data } = await api.get(`smartwatch/${watchCode}`);
      setSmartwatch(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sincronizar o código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout goBackFunction={goBack} title={'Smartwatch'}>
      <View style={styles.container}>
        {loading ? (
          // Display loading indicator while fetching code
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
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
              <TouchableOpacity style={styles.button} onPress={() => handlePairing(watchCode, true)}>
                <Icons.MaterialCommunityIcons name="watch" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {smartwatch && <SmartwatchCards smartwatch={smartwatch} />}
          </>
        )}
      </View>
    </Layout>
  );
};

export default Smartwatch;
