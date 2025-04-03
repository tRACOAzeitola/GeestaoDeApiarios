import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ColmeiasScreen() {
  const { apiaries, addHives } = useApiaryContext();
  const [selectedApiary, setSelectedApiary] = useState('');
  const [good, setGood] = useState('0');
  const [strong, setStrong] = useState('0');
  const [weak, setWeak] = useState('0');
  const [dead, setDead] = useState('0');
  const [observations, setObservations] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedApiary) {
      newErrors.apiary = 'Selecione um apiário';
    }
    
    if (parseInt(good) === 0 && parseInt(strong) === 0 && parseInt(weak) === 0 && parseInt(dead) === 0) {
      newErrors.counts = 'Adicione pelo menos uma colmeia';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddHives = () => {
    if (!validateForm()) {
      return;
    }

    addHives(
      selectedApiary,
      parseInt(good),
      parseInt(strong),
      parseInt(weak),
      parseInt(dead),
      observations
    );
    
    alert('Colmeias adicionadas com sucesso!');
    
    // Reset form
    setSelectedApiary('');
    setGood('0');
    setStrong('0');
    setWeak('0');
    setDead('0');
    setObservations('');
    setErrors({});
    setShowForm(false);
  };

  const handleCancel = () => {
    setSelectedApiary('');
    setGood('0');
    setStrong('0');
    setWeak('0');
    setDead('0');
    setObservations('');
    setErrors({});
    setShowForm(false);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Colmeias</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleFormVisibility}>
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Adicionar Colmeias em Lote</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Apiário</Text>
              <View style={[
                styles.formSelect,
                errors.apiary ? styles.formSelectError : null
              ]}>
                <Picker
                  selectedValue={selectedApiary}
                  onValueChange={(itemValue: string) => setSelectedApiary(itemValue)}
                >
                  <Picker.Item label="Selecione..." value="" />
                  {apiaries.map((apiary) => (
                    <Picker.Item 
                      key={apiary.id} 
                      label={`${apiary.name} (${apiary.id})`} 
                      value={apiary.id} 
                    />
                  ))}
                </Picker>
              </View>
              {errors.apiary && <Text style={styles.errorText}>{errors.apiary}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Quantidade de Colmeias por Estado</Text>
              {errors.counts && <Text style={styles.errorText}>{errors.counts}</Text>}
              <View style={styles.colmeiaCounts}>
                <View style={styles.countInput}>
                  <Text style={styles.countLabel}>Boas (1 pedra ao meio)</Text>
                  <TextInput
                    style={styles.countField}
                    keyboardType="numeric"
                    value={good}
                    onChangeText={setGood}
                  />
                </View>
                
                <View style={styles.countInput}>
                  <Text style={styles.countLabel}>Fortes (2 pedras ao meio)</Text>
                  <TextInput
                    style={styles.countField}
                    keyboardType="numeric"
                    value={strong}
                    onChangeText={setStrong}
                  />
                </View>
                
                <View style={styles.countInput}>
                  <Text style={styles.countLabel}>Fracas (1 pedra à esquerda)</Text>
                  <TextInput
                    style={styles.countField}
                    keyboardType="numeric"
                    value={weak}
                    onChangeText={setWeak}
                  />
                </View>
                
                <View style={styles.countInput}>
                  <Text style={styles.countLabel}>Mortas (1 pau ao meio)</Text>
                  <TextInput
                    style={styles.countField}
                    keyboardType="numeric"
                    value={dead}
                    onChangeText={setDead}
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Observações</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder="Adicione detalhes sobre as colmeias..."
                value={observations}
                onChangeText={setObservations}
              />
            </View>
            
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleAddHives}
              >
                <Text style={styles.primaryButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="grid" size={64} color={Theme.COLORS.primary.light} />
            <Text style={styles.emptyStateTitle}>Gestão de Colmeias</Text>
            <Text style={styles.emptyStateText}>
              Adicione colmeias nos apiários para melhor controle e monitoramento.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, styles.emptyStateButton]}
              onPress={toggleFormVisibility}
            >
              <Text style={styles.primaryButtonText}>Adicionar Colmeias</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.COLORS.background.light,
  },
  header: {
    height: 100,
    backgroundColor: Theme.COLORS.primary.default,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 15,
    top: 45,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    ...Theme.SHADOWS.light,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Theme.COLORS.text.primary,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Theme.COLORS.text.primary,
  },
  formSelect: {
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  formSelectError: {
    borderColor: Theme.COLORS.error,
  },
  colmeiaCounts: {
    gap: 12,
  },
  countInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.surface.default,
    padding: 12,
    borderRadius: 4,
  },
  countLabel: {
    flex: 1,
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
  },
  countField: {
    width: 60,
    padding: 8,
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 4,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.COLORS.secondary.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: Theme.COLORS.secondary.default,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: Theme.COLORS.primary.default,
    borderColor: Theme.COLORS.primary.default,
  },
  primaryButtonText: {
    color: 'white',
  },
  errorText: {
    color: Theme.COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
}); 