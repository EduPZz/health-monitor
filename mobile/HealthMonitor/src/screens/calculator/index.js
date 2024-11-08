import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from './styles';
import Icons from "../../components/Icons";

const Calculator = () => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#282828", "#ffcd43"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      {/* Header */}
      <Text style={styles.header}>Cálculo de IMC</Text>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Idade</Text>
          <Text style={styles.value}>22</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Altura</Text>
          <Text style={styles.value}>1.72</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Peso</Text>
          <Text style={styles.value}>72</Text>
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.genderSection}>
        <Icons.FontAwesome5 name="female" size={24} color="#ffcd43" />
        <View style={styles.separator} />
        <Icons.FontAwesome5 name="male" size={24} color="#fff" />
      </View>

      {/* BMI Result */}
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Índice de massa corporal (IMC)</Text>
        <Text style={styles.bmiValue}>24.9</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Você está saudável</Text>
        </View>

        {/* Range Bar */}
        <View style={styles.rangeBar}>
          <LinearGradient
            colors={["#80c1ff", "#80ffd4", "#ffad60", "#ff6060"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientBar}
          />
          <View style={styles.pointer} />
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
  )
};

export default Calculator;