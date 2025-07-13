import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import api from '../api';
import Icon from './Icons';

export default function UserSearchModal({ visible, onClose, onSelect, mode}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUser = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await api.get(`user?email=${query}&name=${query}`);
      setResults(response.data || []);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user) => {
    closeModal();
    onSelect(user);
  };

  const onInputChange = (text) => {
    setQuery(text);
    if (text.length > 2) {
      searchUser(text);
    } else {
      setResults([]);
    }
  };

  const closeModal = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={closeModal}
      backdropOpacity={0.4}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <Text style={styles.title}>{mode === "share" ? "Compartilhar com alguém" : "Pedir compartilhamento"}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Icon.FontAwesome name="search" size={18} color="#999" />
          <TextInput
            placeholder="Buscar usuário por email ou nome"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            value={query}
            onChangeText={onInputChange}
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userItem} onPress={() => handleSelect(item)}>
              <Text style={styles.userText}>{item.name} ({item.email})</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && query.length > 0 ? (
              <Text style={styles.noResult}>Nenhum usuário encontrado.</Text>
            ) : null
          }
          loading={loading}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    height: '90%',
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#444',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelText: {
    color: '#FFE18E',
    fontSize: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  userItem: {
    paddingVertical: 12,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  noResult: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
