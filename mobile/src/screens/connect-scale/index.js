import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { BleManager, State } from "react-native-ble-plx";
import { Buffer } from "buffer";
import useImpedance from "../../hooks/useImpedance";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import api from "../../api";
import { PermissionsAndroid } from "react-native";

if (!global.Buffer) {
  global.Buffer = Buffer;
}

const WEIGH_SERVICE_UUID = "0000181b-0000-1000-8000-00805f9b34fb";
const WEIGHT_CHARACTERISTIC_UUID = "00002a9c-0000-1000-8000-00805f9b34fb";

const MetricCard = ({ label, value, emoji }) => (
  <View style={localStyles.card}>
    <Text style={localStyles.cardTitle}>
      {emoji} {label}
    </Text>
    <Text style={localStyles.cardValue}>{value}</Text>
  </View>
);

const ConnectScale = ({ navigation, route }) => {
  const eventId = route?.params?.eventId;
  const recipientType = route?.params?.recipientType;
  const recipientData = route?.params?.recipientData;
  const [manager] = useState(new BleManager());
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [impedanceResult, setImpedanceResult] = useState(null);

  const [userSex, setUserSex] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const userBirthDateRef = useRef("");

  const [formHeight, setFormHeight] = useState("");
  const [requestHeigh, setRequestHeight] = useState("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  const goBack = () => navigation.goBack();

  const userAge = (userBirthDate) => {
    if (!userBirthDate) return 0;
    const birthDate = new Date(userBirthDate);
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear();
  };

  const fetchUserData = async () => {
    try {
      const {
        data: { sex, birthDate },
      } = await api.get("auth/profile");
      setUserSex(sex);
      setUserBirthDate(birthDate);
      userBirthDateRef.current = birthDate;
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };


  useEffect(() => {
    // Fetch user data on mount
    fetchUserData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation]);

  // Request permissions and check Bluetooth state
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === "android") {
          // Check Android version
          const androidVersion = Platform.Version;

          if (androidVersion >= 31) {
            // Android 12+ (API 31+) requires new permissions
            const granted = await PermissionsAndroid.requestMultiple([
              "android.permission.BLUETOOTH_SCAN",
              "android.permission.BLUETOOTH_CONNECT",
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            const allGranted = Object.values(granted).every(
              (status) => status === PermissionsAndroid.RESULTS.GRANTED
            );

            if (allGranted) {
              setPermissionsGranted(true);
            } else {
              Alert.alert(
                "Permissões Necessárias",
                "Este aplicativo precisa de permissões de Bluetooth e Localização para conectar dispositivos. Por favor, conceda as permissões nas configurações.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Abrir Configurações",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
              return;
            }
          } else {
            // Android 11 and below
            const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);

            const allGranted = Object.values(granted).every(
              (status) =>
                status === PermissionsAndroid.RESULTS.GRANTED ||
                status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
            );

            if (allGranted) {
              setPermissionsGranted(true);
            } else {
              Alert.alert(
                "Permissões Necessárias",
                "Este aplicativo precisa de permissão de Localização para usar Bluetooth. Por favor, conceda a permissão nas configurações.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Abrir Configurações",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
              return;
            }
          }
        } else {
          // iOS - permissions are handled automatically by the system
          setPermissionsGranted(true);
        }

        // Check Bluetooth state
        const checkBluetoothState = async () => {
          try {
            const state = await manager.state();

            if (state === State.PoweredOn) {
              setBluetoothEnabled(true);
            } else if (state === State.PoweredOff) {
              setBluetoothEnabled(false);
              Alert.alert(
                "Bluetooth Desativado",
                "Por favor, ative o Bluetooth nas configurações do dispositivo para conectar a balança.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Abrir Configurações",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
            } else if (state === State.Unauthorized) {
              Alert.alert(
                "Permissão Bluetooth Negada",
                "Este aplicativo precisa de permissão para usar Bluetooth. Por favor, conceda a permissão nas configurações.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Abrir Configurações",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
            } else {
              // State.Unsupported, State.Unknown, etc.
              setBluetoothEnabled(false);
              Alert.alert(
                "Bluetooth Não Disponível",
                "O Bluetooth não está disponível neste dispositivo.",
                [{ text: "OK" }]
              );
            }
          } catch (error) {
            console.error("Error checking Bluetooth state:", error);
            Alert.alert(
              "Erro",
              "Não foi possível verificar o estado do Bluetooth.",
              [{ text: "OK" }]
            );
          }
        };

        // Monitor Bluetooth state changes
        const subscription = manager.onStateChange((state) => {
          if (state === State.PoweredOn) {
            setBluetoothEnabled(true);
          } else if (state === State.PoweredOff) {
            setBluetoothEnabled(false);
            Alert.alert(
              "Bluetooth Desativado",
              "O Bluetooth foi desativado. Por favor, ative-o para continuar.",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Abrir Configurações",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          }
        }, true); // true = emit current state immediately

        await checkBluetoothState();

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error("Error requesting permissions:", error);
        Alert.alert(
          "Erro",
          "Não foi possível solicitar as permissões necessárias.",
          [{ text: "OK" }]
        );
      }
    };

    requestPermissions();
  }, []);

  const fetchMeasures = async (userBirthDate, scaleResult) => {
    try {
      const { data } = await api.get("body-measure");

      const lastBodyMeasure = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (lastBodyMeasure?.height) {
        setRequestHeight(lastBodyMeasure.height.toString());
        calculateBioimpedance(userBirthDate, lastBodyMeasure.height.toString(), scaleResult);
        return;
      }
      setShowForm(true);
    } catch (error) {
      console.error("Erro ao buscar as medidas corporais:", error);
      setShowForm(true);
    }
  };

  const softDisconnectDevice = () => {
    setIsConnected(false);
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
              // Use ref to get the current value (avoids closure issues)
              fetchMeasures(userBirthDateRef.current, result);
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
      manager.stopDeviceScan();

      const currentConnectedDevice = await manager.connectToDevice(device.id, {
        timeout: 10000,
      });
      await currentConnectedDevice.discoverAllServicesAndCharacteristics();

      setIsConnected(true);
      setConnectedDevices((prev) => [...prev, currentConnectedDevice]);

      await startMonitoring(currentConnectedDevice);
    } catch (error) {
      if (error.errorCode !== 2) {
        console.log("BLE connect error:", error);
      }
      softDisconnectDevice();
    } finally {
      setIsConnecting(false);
    }
  };

  const startScan = () => {
    manager.startDeviceScan(
      [WEIGH_SERVICE_UUID], // procura só devices com o service da balança
      null,
      async (error, device) => {
        if (error) {
          console.log("Scan error:", error);
          return;
        }

        if (device && !isConnected && !isConnecting) {
          await connectAndListen(device);
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
    if (permissionsGranted && bluetoothEnabled) {
      startScan();
    }
    return () => {
      manager.stopDeviceScan();
    };
  }, [permissionsGranted, bluetoothEnabled]);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const saveScaleData = async () => {
    try {
      const connectedDevice = connectedDevices[connectedDevices.length - 1];
      const scaleResponse = await api.post("/bluetooth-scales", {
        macAddress: connectedDevice?.id,
        name: connectedDevice?.name,
        model: "Mi Body Composition Scale 2",
        brand: "Xiaomi",
        supportsImpedance: true,
      });

      const payload = {
        measurementType: "scale",
        bluetoothScaleId: scaleResponse.data.id,
        eventId: eventId || undefined,
        bioimpedanceMeasurement: {
          weight: Math.floor(currentWeight),
          bodyFatPercentage: impedanceResult.fatPercentage,
          muscleMass: impedanceResult.muscleMass,
          boneMass: impedanceResult.boneMass,
          waterPercentage: impedanceResult.waterPercentage,
          visceralFat: impedanceResult.visceralFat,
          metabolicAge: impedanceResult.metabolicAge,
          ...(formHeight && { height: parseFloat(formHeight) / 100 }),
        },
      };

      // Handle recipient data for event measurements
      if (eventId && recipientType) {
        if (recipientType === "anonymous") {
          payload.anonymous = true;
          payload.anonymousName = recipientData.name;
          payload.anonymousEmail = recipientData.email;
          payload.anonymousPhone = recipientData.phone;
        } else if (recipientType === "user" && recipientData?.userId) {
          payload.anonymous = true;
          payload.measuredUserId = recipientData.userId;
        }
      } else {
        payload.anonymous = false;
      }

      await api.post("/measurement-sessions", payload);

      Alert.alert("Sucesso", "Dados salvos com sucesso!");
      if (eventId) {
        // Navigate back to EventDetails if this was an event measurement
        navigation.navigate("EventDetails", { eventId });
      } else {
        // Otherwise go back normally
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to save scale data:", error);
    }
  };

  const calculateBioimpedance = (userBirthDate, height, scaleResult = null) => {
    // Use the passed result or fall back to the last result from state
    const result = scaleResult || results[results.length - 1];

    if (!result) {
      console.error("No scale result available");
      return;
    }

    const sex = userSex === "male" || userSex === "female" ? userSex : "male";
    console.log({
      weight: result?.weight,
      impedance: result?.impedance,
      height: height < 10 ? Number(height * 100) : Number(height),
      age: Number(userAge(userBirthDate)),
    })
    const { fatMassToIdeal, ...calculated } = useImpedance({
      weight: result?.weight,
      impedance: result?.impedance,
      height: height < 10 ? Number(height) * 100 : Number(height),
      age: Number(userAge(userBirthDate)),
      sex,
    });
    setImpedanceResult(calculated);
    setShowForm(false);
  };

  return (
    <Layout goBackFunction={goBack} title={"Conectar dispositivo"}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={localStyles.scroll}
      >
        <View style={localStyles.gaugeContainer}>
          <Text style={localStyles.weightText}>
            {currentWeight > 0
              ? "Peso atual"
              : "Suba na balança para iniciar a medição"}
          </Text>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={currentWeight > 0 ? (currentWeight / 200) * 100 : 0}
            tintColor="#176B87"
            backgroundColor="#E3F2FD"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={localStyles.weightContainer}>
                <Text style={localStyles.weightValue}>
                  {currentWeight > 0 ? currentWeight.toFixed(2) : "--"}
                </Text>
                <Text style={localStyles.weightUnit}>kg</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

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
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={{
                ...localStyles.buttonContainer,
                opacity: !formHeight ? 0.3 : 1,
              }}
              disabled={!formHeight}
              onPress={() =>
                calculateBioimpedance(userBirthDate, formHeight, results[results.length - 1])
              }
            >
              <Text style={localStyles.buttonText}>Calcular</Text>
            </TouchableOpacity>
          </View>
        )}

        {impedanceResult && (
          <>
            <Text style={localStyles.sectionTitle}>
              Resultados de Impedância
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
            <TouchableOpacity style={{ ...localStyles.buttonContainer, backgroundColor: '#28A745' }} onPress={saveScaleData}>
              <Text onPress={saveScaleData} style={{ color: 'white' }}>Salvar dados</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Layout>
  );
};

const localStyles = StyleSheet.create({
  gaugeContainer: {
    alignItems: "center",
    marginVertical: 20,
    gap: 20,
  },
  weightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  weightValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#22313F",
  },
  weightUnit: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  weightText: {
    fontSize: 18,
    marginTop: 10,
    color: "#22313F",
  },
  formContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FFF",
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
    paddingBottom: 40,
    width: "100%",
    paddingHorizontal: 16,
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
    width: "100%",
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
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#176B87",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConnectScale;
