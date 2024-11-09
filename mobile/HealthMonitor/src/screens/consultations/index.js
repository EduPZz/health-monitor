import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import Layout from "../../components/layout";
import styles from "./styles";
import api from "../../api";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icons from "../../components/Icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DateCard = ({ date, userTimezone }) => {
  const dateInTimeZone = new Date(date);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: userTimezone || "UTC",
  }).format(dateInTimeZone);

  return (
    <View style={styles.dateCard}>
      <Text>{formattedDate}</Text>
    </View>
  );
};

const Consultations = ({ navigation }) => {
  const [userTimezone, setUserTimezone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consultationToCreate, setConsultationToCreate] = useState({
    doctorName: "",
    scheduleDate: new Date(),
    specialization: "",
  });
  const [consultations, setConsultations] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goBack = () => navigation.goBack();

  useEffect(() => {
    const fetchUserTimezone = async () => {
      try {
        const {
          data: { timezone },
        } = await api.get("auth/profile");
        setUserTimezone(timezone);
      } catch (error) {
        console.error("Failed to fetch timezone", error);
      }
    };

    const fetchConsultations = async () => {
      try {
        const response = await api.get("consultation");
        setConsultations(response.data); // Assuming `response.data` contains the list of consultations
      } catch (error) {
        console.error("Failed to fetch consultations", error);
        Alert.alert("Não foi possível carregar as consultas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTimezone();
    fetchConsultations();
  }, []);

  const resetConsultationsToCreate = () => {
    setConsultationToCreate({
      doctorName: "",
      scheduleDate: new Date(),
      specialization: "",
    });
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post("consultation", {
        ...consultationToCreate,
        scheduleDate: consultationToCreate.scheduleDate.toISOString(),
        description: "",
      });
      setConsultations([...consultations, data]);
      resetConsultationsToCreate();
    } catch (error) {
      Alert.alert("Não foi possível agendar a consulta.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSaveDisabled = Object.values(consultationToCreate).some((m) => !m);

  const handleDelete = async (id) => {
    try {
      await api.delete(`consultation/${id}`);
      setConsultations(
        consultations.filter((consultation) => consultation.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete consultation", error);
      Alert.alert("Não foi possível deletar a consulta.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setConsultationToCreate({
        ...consultationToCreate,
        scheduleDate: selectedDate,
      });
    }
  };

  return (
    <Layout title="Consultas médicas" goBackFunction={goBack}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <KeyboardAwareScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          extraHeight={100}
        >
          {consultations.length > 0 && (
            <View style={styles.upcomingCard}>
              <Text style={styles.sectionTitle}>Próximas consultas</Text>
              {consultations.map((item) => (
                <View key={item.id.toString()} style={styles.appointmentItem}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.doctorText}>
                      Consulta com {item.doctorName}
                    </Text>
                    <DateCard
                      date={item.scheduleDate}
                      userTimezone={userTimezone}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.typeText}>{item.specialization}</Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      <Icons.MaterialIcons
                        name="delete"
                        size={12}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.addCard}>
            <Text style={styles.sectionTitle}>Adicionar uma consulta</Text>
            <View style={styles.addForm}>
              <View style={styles.input}>
                <Text>Nome do doutor</Text>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#ababab"
                  placeholder="Alberto"
                  value={consultationToCreate.doctorName}
                  onChangeText={(value) =>
                    setConsultationToCreate({
                      ...consultationToCreate,
                      doctorName: value,
                    })
                  }
                />
              </View>
              <View style={styles.input}>
                <Text>Data</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.inputText}>
                    {consultationToCreate.scheduleDate.toLocaleDateString(
                      "pt-BR"
                    )}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={consultationToCreate.scheduleDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
              <View style={styles.input}>
                <Text>Especialização</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Cardiologista"
                  placeholderTextColor="#ababab"
                  value={consultationToCreate.specialization}
                  onChangeText={(value) =>
                    setConsultationToCreate({
                      ...consultationToCreate,
                      specialization: value,
                    })
                  }
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isSaveDisabled && styles.buttonDisabled,
                ]}
                disabled={isSaveDisabled}
                onPress={handleCreate}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Layout>
  );
};

export default Consultations;
