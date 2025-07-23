import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonCard = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.circle} />
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    marginHorizontal: 30,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 110,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  line: {
    width: "50%",
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
});

export default SkeletonCard;
