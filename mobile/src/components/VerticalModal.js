import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

export default function VerticalModal({
  visible,
  onClose,
  title,
  children,
  showCancel = true,
  height = "90%",
  swipeEnabled = true,
}) {
  const closeModal = () => {
    onClose && onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      style={styles.modal}
      swipeDirection={swipeEnabled ? "down" : null}
      onSwipeComplete={swipeEnabled ? closeModal : undefined}
      backdropOpacity={0.4}
    >
      <View style={[styles.content, { height }]}>
        <View style={styles.header}>
          { swipeEnabled && <View style={styles.handle} />}
          <Text style={styles.title}>{title}</Text>
          {showCancel && (
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: "#f2f3f7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelText: {
    color: "#f00",
    fontSize: 16,
  },
  body: {
    flex: 1,
    marginTop: 20,
  },
});
