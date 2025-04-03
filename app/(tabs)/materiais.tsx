import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function MateriaisScreen() {
  const { apiaries, addMaterial } = useApiaryContext();
  const [selectedApiary, setSelectedApiary] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const materialTypes = [
    { label: 'Alça', value: 'alca' },
    { label: 'Colmeia Reversível', value: 'colmeia_reversivel' },
    { label: 'Colmeia Lusitana', value: 'colmeia_lusitana' },
    { label: 'Alimentadores', value: 'alimentadores' },
    { label: 'Quadros', value: 'quadros' },
    { label: 'Cera', value: 'cera' },
    { label: 'Ferramentas', value: 'ferramentas' }
  ];
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedApiary) {
      newErrors.apiary = 'Selecione um apiário';
    }
    
    if (!materialType) {
      newErrors.materialType = 'Selecione um tipo de material';
    }
    
    if (parseInt(quantity) <= 0) {
      newErrors.quantity = 'A quantidade deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMaterial = () => {
    if (!validateForm()) {
      return;
    }

    addMaterial({
      apiary: selectedApiary,
      type: materialType,
      quantity: parseInt(quantity)
    });
    
    alert('Material adicionado com sucesso!');
    
    // Reset form
    setSelectedApiary('');
    setMaterialType('');
    setQuantity('1');
    setErrors({});
    setShowForm(false);
  };

  const handleCancel = () => {
    setSelectedApiary('');
    setMaterialType('');
    setQuantity('1');
    setErrors({});
    setShowForm(false);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Materiais</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleFormVisibility}>
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Adicionar Material</Text>
            
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
              <Text style={styles.formLabel}>Tipo de Material</Text>
              <View style={[
                styles.formSelect,
                errors.materialType ? styles.formSelectError : null
              ]}>
                <Picker
                  selectedValue={materialType}
                  onValueChange={(itemValue: string) => setMaterialType(itemValue)}
                >
                  <Picker.Item label="Selecione..." value="" />
                  {materialTypes.map((material) => (
                    <Picker.Item 
                      key={material.value} 
                      label={material.label} 
                      value={material.value} 
                    />
                  ))}
                </Picker>
              </View>
              {errors.materialType && <Text style={styles.errorText}>{errors.materialType}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Quantidade</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.quantity ? styles.inputError : null
                ]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
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
                onPress={handleAddMaterial}
              >
                <Text style={styles.primaryButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube" size={64} color={Theme.COLORS.primary.light} />
            <Text style={styles.emptyStateTitle}>Gestão de Materiais</Text>
            <Text style={styles.emptyStateText}>
              Adicione materiais aos apiários para melhor controle de inventário.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, styles.emptyStateButton]}
              onPress={toggleFormVisibility}
            >
              <Text style={styles.primaryButtonText}>Adicionar Material</Text>
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
  input: {
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 4,
    padding: 12,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: Theme.COLORS.error,
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