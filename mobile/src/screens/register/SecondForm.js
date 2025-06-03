import { TouchableOpacity, View, Text } from "react-native";
import registerStyle from "./registerStyle";
import React, { useState } from "react";
import { Link } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const SecondForm = ({ onSignup, userData }) => {
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const sexOptions = [
    { label: "Masculino", value: "male" },
    { label: "Feminino", value: "female" },
  ];

  const isFormValid = sex && birthDate;

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={registerStyle.containerAction}>
      <View style={{ width: "100%" }}>
        <Text style={registerStyle.registerTitle}>Informações Pessoais</Text>

        <Text style={registerStyle.inputTitle}>Sexo</Text>
        <View style={registerStyle.blocoInput}>
          <Picker
            selectedValue={sex}
            onValueChange={(itemValue) => setSex(itemValue)}
            style={{ width: "100%" }}
          >
            <Picker.Item label="Selecione o sexo" value="" />
            {sexOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={registerStyle.inputTitle}>Data de Nascimento</Text>
        <TouchableOpacity
          style={registerStyle.blocoInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[registerStyle.input, { color: "#000" }]}>
            {formatDate(birthDate)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              handleDateChange(event, selectedDate)
            }}
            maximumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          registerStyle.registerButtom,
          { opacity: isFormValid ? 1 : 0.5 },
        ]}
        disabled={!isFormValid}
        onPress={() => onSignup({ ...userData, sex, birthDate })}
      >
        <Text style={registerStyle.textButtom}>Finalizar Cadastro</Text>
      </TouchableOpacity>

      <Link to={{ screen: "Login" }} style={registerStyle.textEmphasis}>
        Já tem uma conta? Entrar
      </Link>
    </View>
  );
};

export default SecondForm;
