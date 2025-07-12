import React from 'react';
import { Text } from 'react-native';
import Layout from '../../components/layout';

export default function ShareMedicalRecords({navigation}) {
  const goBack = () => navigation.goBack();

  return (
    <Layout title="Share Medical Records" goBackFunction={goBack}>
      <Text>Share Medical Records</Text>
    </Layout>
  );
}