import React, { useState } from "react";
import VerticalModal from "../../components/VerticalModal";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icons from "../../components/Icons";
import { BlurView } from "expo-blur";
import api from "../../api";
import Toast from "react-native-toast-message";
import getInitials from "../../utils/getInitials";

const ItemCard = ({ item, onAccept, onReject, isLoading }) => {
  return (
    <View style={styles.glassCard}>
      <BlurView intensity={50} tint="light" style={styles.blurWrapper} />

      <Text style={styles.cartTitle}>
        <Icons.Octicons
          name={item.type === "to_share" ? "share" : "download"}
          size={16}
          color="#000"
          style={{ marginRight: 4 }}
        />
        {item.type === "to_share"
          ? "  Querem compartilhar dados com você"
          : "  Querem receber seus dados"}
      </Text>

      <View style={styles.contentCard}>
        <View style={styles.userInfo}>
          <View style={styles.profileImg}>
            <Text style={styles.initials}>
              {getInitials(item.inviter.name)}
            </Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.inviter.name}</Text>
            <Text style={styles.email}>{item.inviter.email}</Text>
          </View>
        </View>

        {item.message ? (
          <View style={styles.messageContainer}>
            <Icons.Ionicons
              name="chatbox-ellipses-outline"
              size={16}
              color="#8E8E93"
            />
            <Text style={styles.message}>Mensagem: {item.message}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.actionButton(true)}
          onPress={() => onAccept(item)}
          disabled={isLoading}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icons.FontAwesome6
              name="circle-check"
              size={16}
              color="#fff"
              solid
            />
            <Text style={styles.actionButton(true).text}>Aceitar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton(false)}
          onPress={() => onReject(item)}
          disabled={isLoading}
        >
          <Text style={styles.actionButton(false).text}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Notifications({
  onClose,
  visible,
  notifications,
  actionCallback,
}) {
  const [isUpdatingItem, setIsUpdatingItem] = useState({});

  const handleAccept = async (item) => {
    try {
      setIsUpdatingItem((prev) => ({ ...prev, [item.id]: true }));
      await api.patch(`/companion-requests/${item.id}/accept`);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Pedido aceito com sucesso!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.response?.data?.message || "Erro ao aceitar pedido",
      });
      onClose();
    } finally {
      setIsUpdatingItem((prev) => ({ ...prev, [item.id]: false }));
      actionCallback(item);
    }
  };

  const handleReject = async (item) => {
    try {
      setIsUpdatingItem((prev) => ({ ...prev, [item.id]: true }));
      await api.patch(`/companion-requests/${item.id}/reject`);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Pedido rejeitado com sucesso!",
      });
      actionCallback(item);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.response?.data?.message || "Erro ao rejeitar pedido",
      });
      onClose();
    } finally {
      setIsUpdatingItem((prev) => ({ ...prev, [item.id]: false }));
      actionCallback(item);
    }
  };

  return (
    <VerticalModal
      onClose={onClose}
      visible={visible}
      title="Notificações"
      swipeEnabled={false}
    >
      <View>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onAccept={() => handleAccept(item)}
              onReject={() => handleReject(item)}
              isLoading={isUpdatingItem[item.id]}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={{ color: "black", textAlign: "center" }}>
              Nenhuma notificação encontrada.
            </Text>
          )}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "black", textAlign: "center" }}>
          Você pode receber notificações de solicitações de companheiros.
        </Text>
      </View>
    </VerticalModal>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  email: {
    fontSize: 14,
    color: "#8E8E93",
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#444",
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    gap: 12,
  },

  actionButton: (isAccept) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
    backgroundColor: isAccept ? "#34C759" : "#FF3B30",
    color: "#fff",
    borderRadius: 6,
    fontWeight: "bold",

    text: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  }),

  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ED702F",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },

  glassCard: {
    borderRadius: 20,
    padding: 20,
    margin: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // transparência do fundo
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // leve borda
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    overflow: "hidden",
  },
  blurWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  contentCard: {
    backgroundColor: "rgba(216, 215, 218, 0.26)",
    padding: 16,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
};
