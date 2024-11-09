import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import Layout from '../../components/layout';
import styles from "./styles";
import api from '../../api';
import DatePicker from 'react-native-date-picker';
import Icons from '../../components/Icons';

const DateCard = ({ date, userTimezone }) => {
  const dateInTimeZone = new Date(date);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: userTimezone || 'UTC',
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
    doctorName: '',
    scheduleDate: new Date(),
    specialization: ''
  });
  const [consultations, setConsultations] = useState([]);
  const goBack = () => navigation.goBack();

  useEffect(() => {
    const fetchUserTimezone = async () => {
      try {
        const { data: { timezone } } = await api.get("auth/profile");
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
      doctorName: '',
      scheduleDate: new Date(),
      specialization: ''
    });
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.post('consultation', {
        ...consultationToCreate,
        scheduleDate: consultationToCreate.scheduleDate.toISOString(),
        description: ''
      });
      setConsultations([...consultations, data]);
      resetConsultationsToCreate();
    } catch (error) {
      Alert.alert("Não foi possível agendar a consulta.");
    } finally {
      setIsLoading(false)
    }
  };

  const isSaveDisabled = Object.values(consultationToCreate).some((m) => !m);

  const handleDelete = async (id) => {
    try {
      await api.delete(`consultation/${id}`);
      setConsultations(consultations.filter(consultation => consultation.id !== id));
    } catch (error) {
      console.error("Failed to delete consultation", error);
      Alert.alert("Não foi possível deletar a consulta.");
    }
  };

  return (
    <Layout title="Consultas médicas" goBackFunction={goBack}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          {consultations.length > 0 && (
            <View style={styles.upcomingCard}>
              <Text style={styles.sectionTitle}>Próximas consultas</Text>
              <FlatList
                data={consultations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.appointmentItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={styles.doctorText}>Consulta com {item.doctorName}</Text>
                      <DateCard date={item.scheduleDate} userTimezone={userTimezone} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={styles.typeText}>{item.specialization}</Text>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                        <Icons.MaterialIcons name="delete" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <View style={styles.addCard}>
            <Text style={styles.sectionTitle}>Adicionar uma consulta</Text>
            <View style={styles.addForm}>
              <View style={styles.input}>
                <Text>Nome do doutor</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Alberto"
                  value={consultationToCreate.doctorName}
                  onChangeText={(value) => setConsultationToCreate({ ...consultationToCreate, doctorName: value })}
                />
              </View>
              <View style={styles.input}>
                <Text>Data</Text>
                <DatePicker
                  style={styles.inputText}
                  date={consultationToCreate.scheduleDate}
                  onDateChange={(value) => setConsultationToCreate({ ...consultationToCreate, scheduleDate: value })}
                />
              </View>
              <View style={styles.input}>
                <Text>Especialização</Text>
                <TextInput
                  style={styles.inputText}
                  placeholder="Cardiologista"
                  value={consultationToCreate.specialization}
                  onChangeText={(value) => setConsultationToCreate({ ...consultationToCreate, specialization: value })}
                />
              </View>
              <TouchableOpacity style={[
                styles.addButton,
                isSaveDisabled && styles.buttonDisabled,
              ]} disabled={isSaveDisabled} onPress={handleCreate}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Layout>
  );
};

export default Consultations;
