import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import Layout from "../../components/layout";
import UserSearchModal from "../../components/UserSearchModal";
import Icons from "../../components/Icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomPicker from "../../components/CustomPicker";


const MeasurementRecipientSelection = ({ navigation, route }) => {
  const eventId = route?.params?.eventId;
  const [recipientType, setRecipientType] = useState(null); // 'anonymous' or 'user'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [anonymousData, setAnonymousData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "",
    height: "",
  });
  const [userMeasurementData, setUserMeasurementData] = useState({
    age: "",
    sex: "",
    height: "",
  });

  const sexOptions = [
    { label: "Masculino", value: "male" },
    { label: "Feminino", value: "female" },
  ];


  const goBack = () => navigation.goBack();

  const handleRecipientTypeSelect = (type) => {
    setRecipientType(type);
    if (type === "user") {
      setShowUserSearch(true);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setRecipientType("user");
    // Reset user measurement data when selecting a new user
    setUserMeasurementData({
      age: "",
      sex: "",
      height: "",
    });
  };

  const handleAnonymousInputChange = (field, value) => {
    setAnonymousData({
      ...anonymousData,
      [field]: value,
    });
  };

  const handleUserMeasurementInputChange = (field, value) => {
    setUserMeasurementData({
      ...userMeasurementData,
      [field]: value,
    });
  };

  const isFormValid = () => {
    if (recipientType === "anonymous") {
      return (
        anonymousData.name.trim() !== "" &&
        anonymousData.email.trim() !== "" &&
        anonymousData.phone.trim() !== "" &&
        anonymousData.age.trim() !== "" &&
        anonymousData.height.trim() !== "" &&
        anonymousData.sex.trim() !== ""
      );
    }
    if (recipientType === "user") {
      return (
        selectedUser !== null &&
        userMeasurementData.age.trim() !== "" &&
        userMeasurementData.height.trim() !== "" &&
        userMeasurementData.sex.trim() !== ""
      );
    }
    return false;
  };

  const handleContinue = () => {
    if (!isFormValid()) {
      Alert.alert(
        "Erro",
        recipientType === "anonymous"
          ? "Por favor, preencha todos os campos."
          : "Por favor, preencha todos os campos de medição."
      );
      return;
    }

    // Navigate to measurement selection with recipient data
    navigation.navigate("MeasurementSelection", {
      eventId,
      recipientType,
      recipientData:
        recipientType === "anonymous"
          ? anonymousData
          : {
              userId: selectedUser.id,
              sex: userMeasurementData.sex,
              height: userMeasurementData.height,
              age: userMeasurementData.age,
            },
    });
  };

  return (
    <Layout goBackFunction={goBack} title="Selecionar Recipiente">
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
      >
        <Text style={styles.subtitle}>
          Quem está sendo medido?
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              recipientType === "user" && styles.optionCardSelected,
            ]}
            onPress={() => handleRecipientTypeSelect("user")}
          >
            <View style={styles.optionHeader}>
              <Icons.FontAwesome6 name="user" size={32} color="#4CAF50" />
              <Text style={styles.optionTitle}>Usuário cadastrado</Text>
            </View>
            <Text style={styles.optionDescription}>
              Selecione um usuário já cadastrado no sistema
            </Text>
            {selectedUser && (
              <View style={styles.selectedUserContainer}>
                <Text style={styles.selectedUserText}>
                  ✓ {selectedUser.name} ({selectedUser.email})
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              recipientType === "anonymous" && styles.optionCardSelected,
            ]}
            onPress={() => handleRecipientTypeSelect("anonymous")}
          >
            <View style={styles.optionHeader}>
              <Icons.MaterialCommunityIcons
                name="account-question"
                size={32}
                color="#2196F3"
              />
              <Text style={styles.optionTitle}>Anônimo</Text>
            </View>
            <Text style={styles.optionDescription}>
              Preencha os dados da pessoa que será medida
            </Text>
          </TouchableOpacity>
        </View>

        {recipientType === "anonymous" && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Dados da Pessoa</Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              value={anonymousData.name}
              onChangeText={(value) => handleAnonymousInputChange("name", value)}
              placeholder="Nome completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={anonymousData.email}
              onChangeText={(value) =>
                handleAnonymousInputChange("email", value)
              }
              placeholder="email@exemplo.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={styles.input}
              value={anonymousData.phone}
              onChangeText={(value) =>
                handleAnonymousInputChange("phone", value)
              }
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Altura (cm)*</Text>
            <TextInput
              style={styles.input}
              value={anonymousData.height}
              onChangeText={(value) =>
                handleAnonymousInputChange("height", value)
              }
              placeholder="Altura em centímetros"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />


            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              value={anonymousData.age}
              onChangeText={(value) =>
                handleAnonymousInputChange("age", value)
              }
              placeholder="Idade em anos"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Sexo *</Text>
            <CustomPicker
              options={sexOptions}
              selectedValue={anonymousData.sex}
              onValueChange={(value) => handleAnonymousInputChange("sex", value)}
            />
          </View>

        )}

        {recipientType === "user" && !selectedUser && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowUserSearch(true)}
          >
            <Icons.FontAwesome name="search" size={18} color="#fff" />
            <Text style={styles.searchButtonText}>Buscar usuário</Text>
          </TouchableOpacity>
        )}

        {recipientType === "user" && selectedUser && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Dados para Medição</Text>
            <Text style={styles.formSubtitle}>
              Informe os dados de {selectedUser.name} para a medição
            </Text>

            <Text style={styles.label}>Altura (cm) *</Text>
            <TextInput
              style={styles.input}
              value={userMeasurementData.height}
              onChangeText={(value) =>
                handleUserMeasurementInputChange("height", value)
              }
              placeholder="Altura em centímetros"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              value={userMeasurementData.age}
              onChangeText={(value) =>
                handleUserMeasurementInputChange("age", value)
              }
              placeholder="Idade em anos"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Sexo *</Text>
            <CustomPicker
              options={sexOptions}
              selectedValue={userMeasurementData.sex}
              onValueChange={(value) =>
                handleUserMeasurementInputChange("sex", value)
              }
            />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid()}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>

        <UserSearchModal
          visible={showUserSearch}
          onClose={() => setShowUserSearch(false)}
          onSelect={handleUserSelect}
          mode="measurement"
        />
      </KeyboardAwareScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  optionCardSelected: {
    borderColor: "#176B87",
    backgroundColor: "#F0F8FF",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22313F",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  selectedUserContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  selectedUserText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexGrow: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22313F",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#22313F",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#22313F",
  },
  searchButton: {
    backgroundColor: "#176B87",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#176B87",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  continueButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MeasurementRecipientSelection;



