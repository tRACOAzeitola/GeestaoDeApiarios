import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useApiaryContext } from '@/context/ApiaryContext';

export default function ApiariesScreen() {
  const { addApiary } = useApiaryContext();
  const [apiaryId, setApiaryId] = useState('');
  const [apiaryName, setApiaryName] = useState('');
  const [location, setLocation] = useState('');
  const [floraType, setFloraType] = useState('');

  const handleAddApiary = () => {
    if (!apiaryId || !apiaryName || !floraType) {
      alert('Por favor, preencha os campos obrigatórios!');
      return;
    }

    // Add apiary through context
    addApiary({
      id: apiaryId,
      name: apiaryName,
      location: location || 'Localização não especificada',
      flora: floraType
    });
    
    alert('Apiário adicionado com sucesso!');
    
    // Reset form
    setApiaryId('');
    setApiaryName('');
    setLocation('');
    setFloraType('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adicionar Novo Apiário</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>ID do Apiário</Text>
              <TextInput
                style={styles.formControl}
                placeholder="Ex: API-004"
                value={apiaryId}
                onChangeText={setApiaryId}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nome do Apiário</Text>
              <TextInput
                style={styles.formControl}
                placeholder="Ex: Apiário Rosmaninho"
                value={apiaryName}
                onChangeText={setApiaryName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Localização (opcional)</Text>
              <TextInput
                style={styles.formControl}
                placeholder="Latitude, Longitude"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tipo de Flora</Text>
              <View style={styles.formSelect}>
                <Picker
                  selectedValue={floraType}
                  onValueChange={(itemValue: string) => setFloraType(itemValue)}
                >
                  <Picker.Item label="Selecione..." value="" />
                  <Picker.Item label="Rosmaninho" value="rosmaninho" />
                  <Picker.Item label="7 Sangrias" value="7sangrias" />
                  <Picker.Item label="Flor de Castanheiro" value="castanheiro" />
                  <Picker.Item label="Melada de Carvalho" value="carvalho" />
                  <Picker.Item label="Multi Floral" value="multifloral" />
                  <Picker.Item label="Eucalipto" value="eucalipto" />
                </Picker>
              </View>
            </View>
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnPrimary}
                onPress={handleAddApiary}
              >
                <Text style={styles.btnPrimaryText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#795548',
  },
  formContainer: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  formControl: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  formSelect: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  formActions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#795548',
  },
  btnOutlineText: {
    color: '#795548',
    fontWeight: '500',
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  btnPrimaryText: {
    color: '#795548',
    fontWeight: '500',
  },
}); 