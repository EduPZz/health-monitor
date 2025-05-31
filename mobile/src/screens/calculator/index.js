import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import Icons from "../../components/Icons";

const Calculator = () => {
  const [age, setAge] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [imc, setImc] = useState();
  const [healthStatus, setHealthStatus] = useState("");
  const [pointerPosition, setPointerPosition] = useState(0);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const calculatedImc =
        parseFloat(weight) / (heightInMeters * heightInMeters);
      setImc(calculatedImc.toFixed(1));
    }
  }, [height, weight]);

  useEffect(() => {
    if (imc) {
      let status = "";
      if (imc < 18.5) status = "Abaixo do peso";
      else if (imc >= 18.5 && imc <= 24.9) status = "Saudável";
      else if (imc >= 25 && imc <= 29.9) status = "Sobrepeso";
      else status = "Obesidade";
      setHealthStatus(status);

      const minImc = 15;
      const maxImc = 40;
      const clampedImc = Math.min(Math.max(imc, minImc), maxImc);
      const position = ((clampedImc - minImc) / (maxImc - minImc)) * 100;
      setPointerPosition(position);
    }
  }, [imc]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#282828", "#ffcd43"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <Text style={styles.header}>Cálculo de IMC</Text>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputBox}>
          <View>
            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.value}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="Idade"
              placeholderTextColor="#FFF"
            />
          </View>
          <View>
            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput
              style={styles.value}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="Altura"
              placeholderTextColor="#FFF"
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <View style={styles.genderSection}>
            <TouchableOpacity onPress={() => setGender("female")}>
              <Icons.FontAwesome5
                name="female"
                size={28}
                color={gender === "female" ? "#ffcd43" : "#fff"}
              />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => setGender("male")}>
              <Icons.FontAwesome5
                name="male"
                size={28}
                color={gender === "male" ? "#ffcd43" : "#fff"}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.value}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Peso"
              placeholderTextColor="#FFF"
            />
          </View>
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Índice de massa corporal (IMC)</Text>
        <Text style={styles.bmiValue}>{imc ?? 0}</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{healthStatus}</Text>
        </View>

        <View style={styles.rangeBar}>
          <LinearGradient
            colors={["#80c1ff", "#80ffd4", "#ffad60", "#ff6060"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientBar}
          />
          <View style={[styles.pointer, { left: `${pointerPosition}%` }]} />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>15</Text>
            <Text style={styles.rangeLabel}>18.5</Text>
            <Text style={styles.rangeLabel}>25</Text>
            <Text style={styles.rangeLabel}>30</Text>
            <Text style={styles.rangeLabel}>40</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Calculator;
