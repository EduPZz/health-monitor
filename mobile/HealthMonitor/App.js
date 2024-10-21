import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from './components/Footer';

const App = () => {
  console.log("rodou o myapp");
  return (
    <View style={styles.container}>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(90deg, rgba(40,40,40,1) 73%, rgba(255,205,67,1) 100%)',
  },
});

export default App; 