import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import styles from "./styles";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  FlatList,
  TextInput,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import useImpedance from "../../hooks/useImpedance";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import api from "../../api";

if (!global.Buffer) {
  global.Buffer = Buffer;
}

const WEIGH_SERVICE_UUID = "0000181b-0000-1000-8000-00805f9b34fb";
const WEIGHT_CHARACTERISTIC_UUID = "00002a9c-0000-1000-8000-00805f9b34fb";

const MetricCard = ({ label, value, emoji }) => (
  <View style={localStyles.card}>
    <Text style={localStyles.cardTitle}>{emoji} {label}</Text>
    <Text style={localStyles.cardValue}>{value}</Text>
  </View>
);

const ConnectScale = ({ navigation }) => {
  const [manager] = useState(new BleManager());
  const [miDevices, setMiDevices] = useState([]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [impedanceResult, setImpedanceResult] = useState(null);

  const [userSex, setUserSex] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");

  const [formSex, setFormSex] = useState("");
  const [formHeight, setFormHeight] = useState("");
  const [formAge, setFormAge] = useState("");

  const goBack = () => navigation.goBack();

  const userAge = () => {
    if (!userBirthDate) return 0;
    const birthDate = new Date(userBirthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { sex, birthDate },
        } = await api.get("auth/profile");
        setUserSex(sex);
        setUserBirthDate(birthDate);
      } catch (error) {
        console.error("Failed to fetch timezone", error);
      }
    };

    fetchUserData();
  }, []);

  const softDisconnectDevice = () => {
    setIsConnected(false);
    setConnectedDevice(null);
  };

  const checkDeviceConnection = async (device) => {
    try {
      const isDeviceConnected = await device.isConnected();
      if (isDeviceConnected) {
        setIsConnected(true);
        setConnectedDevice(device);
        await startMonitoring(device);
        return true;
      }
      softDisconnectDevice();
      return false;
    } catch (error) {
      return false;
    }
  };

  const startMonitoring = async (device) => {
    try {
      await device.discoverAllServicesAndCharacteristics();

      device.monitorCharacteristicForService(
        WEIGH_SERVICE_UUID,
        WEIGHT_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            if (error.message.includes("was disconnected")) {
              softDisconnectDevice();
            }
            return;
          }

          if (characteristic?.value) {
            const buffer = Buffer.from(characteristic.value, "base64");
            const result = parseMiScalePacket(buffer);
            if (result?.weight && result.weight > 0) {
              setCurrentWeight(result.weight);
            }
            if (result?.hasImpedance && result?.impedance) {
              setResults((prevResults) => [...prevResults, result]);
              device.cancelConnection();
              softDisconnectDevice();
              manager.stopDeviceScan();
              setShowForm(true);
            }
          }
        },
        undefined,
        "indication"
      );
    } catch (error) {
      softDisconnectDevice();
    }
  };

  const connectAndListen = async (device) => {
    if (isConnecting || isConnected) return;

    try {
      setIsConnecting(true);
      const connectedDevice = await manager.connectToDevice(device.id);
      const isAlreadyConnected = await checkDeviceConnection(connectedDevice);
      if (isAlreadyConnected) {
        setIsConnected(true);
        setConnectedDevice(connectedDevice);
        await startMonitoring(connectedDevice);
        return;
      }
      setIsConnected(true);
      setConnectedDevice(connectedDevice);
      await startMonitoring(connectedDevice);
    } catch (error) {
      softDisconnectDevice();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        softDisconnectDevice();
      } catch (error) {}
    }
  };

  const startScan = () => {
    setMiDevices([]);
    manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      async (error, device) => {
        if (error) {
          return;
        }
        if (device?.name?.includes("MIBFS")) {
          setMiDevices([device]);
          const isConnected = await checkDeviceConnection(device);
          if (isConnected) {
            return;
          }
          connectAndListen(device);
        }
      }
    );
  };

  function parseMiScalePacket(buffer) {
    if (buffer.length < 13) return null;
    const ctrlByte1 = buffer[1];
    const isEmpty = !!(ctrlByte1 & (1 << 7));
    const isStabilized = !!(ctrlByte1 & (1 << 5));
    const hasImpedance = !!(ctrlByte1 & (1 << 1));
    const year = buffer.readUInt16LE(2);
    const month = buffer[4];
    const day = buffer[5];
    const hour = buffer[6];
    const minute = buffer[7];
    const second = buffer[8];
    const impedance = buffer.readUInt16LE(9);
    const weightRaw = buffer.readUInt16LE(11);
    const weight = weightRaw / 200;
    const measuredAt = new Date(year, month - 1, day, hour, minute, second);
    return {
      weight,
      impedance: hasImpedance ? impedance : null,
      isStabilized,
      isEmpty,
      hasImpedance,
      measuredAt,
    };
  }

  useEffect(() => {
    startScan();
    return () => {
      manager.destroy();
    };
  }, []);

  const saveScaleData = async () => {
    try {
      // First save the scale device
      const scaleResponse = await api.post("/bluetooth-scales", {
        macAddress: connectedDevice.id,
        name: connectedDevice.name,
        model: "Mi Body Composition Scale",
        brand: "Xiaomi",
        supportsImpedance: true,
      });

      // Then save the measurement session with bioimpedance data
      const measurementResponse = await api.post("/measurement-sessions", {
        measurementType: "scale",
        bluetoothScaleId: scaleResponse.data.id,
        anonymous: false,
        bioimpedanceMeasurement: {
          weight: impedanceResult.weight,
          bodyFatPercentage: impedanceResult.fatPercentage,
          muscleMass: impedanceResult.muscleMass,
          boneMass: impedanceResult.boneMass,
          waterPercentage: impedanceResult.waterPercentage,
          visceralFat: impedanceResult.visceralFat,
          metabolicAge: impedanceResult.metabolicAge,
        },
      });
    } catch (error) {
      console.error("Failed to save scale data:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Layout goBackFunction={goBack} title={"Conectar dispositivo"}>
      <View style={styles.container}>
        <View style={localStyles.gaugeContainer}>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={currentWeight > 0 ? (currentWeight / 200) * 100 : 0}
            tintColor="#4CAF50"
            backgroundColor="#f5f5f5"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={localStyles.weightContainer}>
                <Text style={localStyles.weightValue}>
                  {currentWeight > 0 ? currentWeight.toFixed(1) : "---"}
                </Text>
                <Text style={localStyles.weightUnit}>kg</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={localStyles.weightText}>
            {currentWeight > 0 ? "Peso atual" : "Aguardando medição..."}
          </Text>
        </View>

        {(!showForm && !impedanceResult) && (
          <>
            <Text style={localStyles.devicesTitle}>
              Dispositivos encontrados:
            </Text>
            <FlatList
              data={miDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={localStyles.deviceItem}>
                  <Text style={localStyles.deviceName}>
                    Device: {item.name}
                  </Text>
                  {isConnected ? (
                    <Button
                      title="Desconectar"
                      onPress={disconnectDevice}
                      color="#ff4444"
                    />
                  ) : (
                    <Button
                      title="Conectar"
                      onPress={() => connectAndListen(item)}
                    />
                  )}
                </View>
              )}
            />
            <Button
              title="Parar busca"
              onPress={() => {
                manager.stopDeviceScan();
              }}
            />
          </>
        )}

        {showForm && (
          <View style={localStyles.formContainer}>
            <Text style={localStyles.formTitle}>Preencha seus dados</Text>
            <Text style={{ marginBottom: 6 }}>Altura (cm)</Text>
            <TextInput
              style={localStyles.input}
              keyboardType="numeric"
              value={formHeight}
              onChangeText={setFormHeight}
              placeholder="Digite sua altura em cm"
            />
            <Button
              title="Calcular"
              onPress={() => {
                const result = results[results.length - 1];
                const sex =
                  userSex === "male" || userSex === "female" ? userSex : "male";
                const { fatMassToIdeal, ...calculated } = useImpedance({
                  weight: result?.weight,
                  impedance: result?.impedance,
                  height: Number(formHeight),
                  age: Number(userAge()),
                  sex,
                });
                setImpedanceResult(calculated);
                setShowForm(false);
              }}
            />
          </View>
        )}

        {impedanceResult && (
          <ScrollView contentContainerStyle={localStyles.scroll}>
            <Text style={localStyles.sectionTitle}>
              Resultados de Impedância
            </Text>
            <ScrollView contentContainerStyle={localStyles.scroll}>
              <Text style={localStyles.sectionTitle}>
                🧍 Composição corporal
              </Text>
              <MetricCard
                label="Gordura"
                value={`${impedanceResult.fatPercentage}%`}
                emoji="🔥"
              />
              <MetricCard
                label="Água"
                value={`${impedanceResult.waterPercentage}%`}
                emoji="💧"
              />
              <MetricCard
                label="Proteína"
                value={`${impedanceResult.proteinPercentage}%`}
                emoji="🥚"
              />
              <MetricCard
                label="Tipo corporal"
                value={impedanceResult.bodyType}
                emoji="🧍"
              />

              <Text style={localStyles.sectionTitle}>💪 Massa e estrutura</Text>
              <MetricCard
                label="Massa muscular"
                value={`${impedanceResult.muscleMass} kg`}
                emoji="💪"
              />
              <MetricCard
                label="Massa óssea"
                value={`${impedanceResult.boneMass} kg`}
                emoji="🦴"
              />
              <MetricCard
                label="Gordura visceral"
                value={impedanceResult.visceralFat}
                emoji="🍔"
              />

              <Text style={localStyles.sectionTitle}>
                ⚙️ Metabolismo e saúde
              </Text>
              <MetricCard label="IMC" value={impedanceResult.bmi} emoji="📊" />
              <MetricCard
                label="Idade metabólica"
                value={`${impedanceResult.metabolicAge} anos`}
                emoji="🧠"
              />
              <MetricCard
                label="Taxa metabólica basal"
                value={`${impedanceResult.bmr} kcal`}
                emoji="⚡️"
              />
              <MetricCard
                label="Peso ideal"
                value={`${impedanceResult.idealWeight} kg`}
                emoji="🎯"
              />
            </ScrollView>

            <View style={localStyles.buttonContainer}>
              <Button title="Salvar" onPress={saveScaleData} color="#4CAF50" />
            </View>
          </ScrollView>
        )}
      </View>
    </Layout>
  );
};

const localStyles = StyleSheet.create({
  gaugeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  weightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  weightValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  weightUnit: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  weightText: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
  },
  devicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  deviceItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  formContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 300,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 30,
  },
});

export default ConnectScale;
