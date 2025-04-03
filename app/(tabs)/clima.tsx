import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApiaryContext } from '../../context/ApiaryContext';
import Theme from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ClimaScreen() {
  const { apiaries, updateWeather, updateLastVisit } = useApiaryContext();
  const [selectedApiary, setSelectedApiary] = useState('');
  const [temperature, setTemperature] = useState('');
  const [condition, setCondition] = useState('');
  const [humidity, setHumidity] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weatherConditions = [
    { label: 'Ensolarado', value: 'Ensolarado' },
    { label: 'Parcialmente nublado', value: 'Parcialmente nublado' },
    { label: 'Nublado', value: 'Nublado' },
    { label: 'Chuvoso', value: 'Chuvoso' },
    { label: 'Tempestuoso', value: 'Tempestuoso' },
    { label: 'Ventoso', value: 'Ventoso' },
    { label: 'Nevado', value: 'Nevado' }
  ];
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedApiary) {
      newErrors.apiary = 'Selecione um apiário';
    }
    
    if (!temperature) {
      newErrors.temperature = 'Informe a temperatura';
    }
    
    if (!condition) {
      newErrors.condition = 'Selecione uma condição climática';
    }
    
    if (!humidity) {
      newErrors.humidity = 'Informe a umidade';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateWeather = () => {
    if (!validateForm()) {
      return;
    }

    // Update weather information
    updateWeather(
      selectedApiary,
      `${temperature}°C`,
      condition,
      `${humidity}%`
    );
    
    // Update last visit date if provided
    if (visitDate) {
      updateLastVisit(selectedApiary, visitDate);
    }
    
    alert('Informações climáticas atualizadas com sucesso!');
    
    // Reset form
    setSelectedApiary('');
    setTemperature('');
    setCondition('');
    setHumidity('');
    setVisitDate('');
    setErrors({});
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('sol')) return 'sunny';
    if (condition.toLowerCase().includes('nubl')) return 'cloudy';
    if (condition.toLowerCase().includes('chuv')) return 'rainy';
    if (condition.toLowerCase().includes('temp')) return 'thunderstorm';
    if (condition.toLowerCase().includes('vent')) return 'cloud';
    if (condition.toLowerCase().includes('nev')) return 'snow';
    return 'partly-sunny';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clima</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Atualizar Condições Climáticas</Text>
          
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
            <Text style={styles.formLabel}>Temperatura (°C)</Text>
            <TextInput
              style={[
                styles.input,
                errors.temperature ? styles.inputError : null
              ]}
              keyboardType="numeric"
              placeholder="Ex: 22"
              value={temperature}
              onChangeText={setTemperature}
            />
            {errors.temperature && <Text style={styles.errorText}>{errors.temperature}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Condição Climática</Text>
            <View style={[
              styles.formSelect,
              errors.condition ? styles.formSelectError : null
            ]}>
              <Picker
                selectedValue={condition}
                onValueChange={(itemValue: string) => setCondition(itemValue)}
              >
                <Picker.Item label="Selecione..." value="" />
                {weatherConditions.map((weatherCondition) => (
                  <Picker.Item 
                    key={weatherCondition.value} 
                    label={weatherCondition.label} 
                    value={weatherCondition.value} 
                  />
                ))}
              </Picker>
            </View>
            {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Umidade (%)</Text>
            <TextInput
              style={[
                styles.input,
                errors.humidity ? styles.inputError : null
              ]}
              keyboardType="numeric"
              placeholder="Ex: 65"
              value={humidity}
              onChangeText={setHumidity}
            />
            {errors.humidity && <Text style={styles.errorText}>{errors.humidity}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Data da Visita (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD (Ex: 2023-11-15)"
              value={visitDate}
              onChangeText={setVisitDate}
            />
            <Text style={styles.helperText}>
              Deixe em branco para usar a data de hoje
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, styles.fullWidthButton]}
            onPress={handleUpdateWeather}
          >
            <Text style={styles.primaryButtonText}>Atualizar Condições</Text>
          </TouchableOpacity>
        </View>
        
        {/* Current Weather Information */}
        <Text style={styles.sectionTitle}>Condições Atuais</Text>
        {apiaries.length > 0 ? (
          apiaries.map((apiary) => (
            <View key={apiary.id} style={styles.weatherCard}>
              <View style={styles.weatherHeader}>
                <Text style={styles.apiaryName}>{apiary.name} ({apiary.id})</Text>
                <View style={styles.weatherIcon}>
                  <Ionicons 
                    name={getWeatherIcon(apiary.weather.condition)} 
                    size={24} 
                    color={Theme.COLORS.primary.default} 
                  />
                </View>
              </View>
              
              <View style={styles.weatherInfo}>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherLabel}>Temperatura</Text>
                  <Text style={styles.weatherValue}>{apiary.weather.temperature}</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherLabel}>Condição</Text>
                  <Text style={styles.weatherValue}>{apiary.weather.condition}</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherLabel}>Umidade</Text>
                  <Text style={styles.weatherValue}>{apiary.weather.humidity}</Text>
                </View>
              </View>
              
              <Text style={styles.lastVisitText}>
                Última visita: {apiary.lastVisit}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum apiário cadastrado.</Text>
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
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 16,
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
  helperText: {
    fontSize: 12,
    color: Theme.COLORS.text.secondary,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.COLORS.secondary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
    fontWeight: '500',
  },
  fullWidthButton: {
    width: '100%',
  },
  errorText: {
    color: Theme.COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Theme.COLORS.text.primary,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Theme.SHADOWS.light,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  apiaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.COLORS.text.primary,
  },
  weatherIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Theme.COLORS.background.light,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weatherDetail: {
    alignItems: 'center',
    flex: 1,
  },
  weatherLabel: {
    fontSize: 12,
    color: Theme.COLORS.text.secondary,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.COLORS.text.primary,
  },
  lastVisitText: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    ...Theme.SHADOWS.light,
  },
  emptyText: {
    color: Theme.COLORS.text.secondary,
    fontSize: 16,
  },
}); 