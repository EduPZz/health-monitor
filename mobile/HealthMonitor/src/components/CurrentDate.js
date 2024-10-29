import React from "react";
import { Text, StyleSheet } from "react-native";

const CurrentDate = () => {
    const currentDate = new Date();
  
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
  
    const fullDate = `${day} de ${month} de ${year}`;
  
    return(
      <Text style={styles.textDate}>
        {fullDate}
      </Text>
    );
}

const styles = StyleSheet.create({
    textDate: {
        fontSize: '12px',
        fontWeight: 'semibold',
        color: '#fff',
        fontFamily: 'Roboto'
    }
}); 

export default CurrentDate;