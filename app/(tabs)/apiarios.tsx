import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApiaryContext } from '../../context/ApiaryContext';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ApiariesScreen() {
  const { addApiary } = useApiaryContext();
  const [apiaryId, setApiaryId] = useState('');
  const [apiaryName, setApiaryName] = useState('');
  const [location, setLocation] = useState('');
  const [floraType, setFloraType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!apiaryId) {
      newErrors.apiaryId = 'ID do apiário é obrigatório';
    }
    
    if (!apiaryName) {
      newErrors.apiaryName = 'Nome do apiário é obrigatório';
    }
    
    if (!floraType) {
      newErrors.floraType = 'Tipo de flora é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleAddApiary = () => {
    // Mark all fields as touched
    setTouched({
      apiaryId: true,
      apiaryName: true,
      floraType: true
    });
    
    if (!validateForm()) {
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
    setErrors({});
    setTouched({});
    setShowForm(false);
  };

  const handleCancel = () => {
    setApiaryId('');
    setApiaryName('');
    setLocation('');
    setFloraType('');
    setErrors({});
    setTouched({});
    setShowForm(false);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Apiários</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleFormVisibility}>
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Adicionar Novo Apiário</Text>
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ID do Apiário</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.apiaryId && touched.apiaryId ? styles.inputError : null
                  ]}
                  placeholder="Ex: API-004"
                  value={apiaryId}
                  onChangeText={setApiaryId}
                  onBlur={() => handleBlur('apiaryId')}
                />
                {errors.apiaryId && touched.apiaryId && (
                  <Text style={styles.errorText}>{errors.apiaryId}</Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome do Apiário</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.apiaryName && touched.apiaryName ? styles.inputError : null
                  ]}
                  placeholder="Ex: Apiário Rosmaninho"
                  value={apiaryName}
                  onChangeText={setApiaryName}
                  onBlur={() => handleBlur('apiaryName')}
                />
                {errors.apiaryName && touched.apiaryName && (
                  <Text style={styles.errorText}>{errors.apiaryName}</Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Localização (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Latitude, Longitude"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tipo de Flora</Text>
                <View style={[
                  styles.formSelect,
                  errors.floraType && touched.floraType ? styles.formSelectError : null
                ]}>
                  <Picker
                    selectedValue={floraType}
                    onValueChange={(itemValue: string) => {
                      setFloraType(itemValue);
                      setTouched({ ...touched, floraType: true });
                    }}
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
                {errors.floraType && touched.floraType && (
                  <Text style={styles.errorText}>{errors.floraType}</Text>
                )}
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
                  onPress={handleAddApiary}
                >
                  <Text style={styles.primaryButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="leaf" size={64} color={Theme.COLORS.primary.light} />
            <Text style={styles.emptyStateTitle}>Sem Apiários</Text>
            <Text style={styles.emptyStateText}>
              Clique no botão + para adicionar um novo apiário ao sistema.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, styles.emptyStateButton]}
              onPress={toggleFormVisibility}
            >
              <Text style={styles.primaryButtonText}>Adicionar Apiário</Text>
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
    color: Theme.COLORS.secondary.default,
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
    fontSize: 14,
    color: Theme.COLORS.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  formSelect: {
    borderWidth: 1,
    borderColor: Theme.COLORS.border.light,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 4,
  },
  formSelectError: {
    borderColor: 'red',
  },
  formActions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.COLORS.primary.default,
  },
  buttonText: {
    color: Theme.COLORS.primary.default,
    fontWeight: '500',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: Theme.COLORS.primary.default,
    borderColor: Theme.COLORS.primary.default,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.COLORS.text.primary,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Theme.COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
}); 