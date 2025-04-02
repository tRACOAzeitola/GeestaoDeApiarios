import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useApiaryContext } from '@/context/ApiaryContext';

// Define Apiary type
interface Apiary {
  id: string;
  name: string;
  location: string;
  flora: string;
  lastVisit: string;
  weather: {
    temperature: string;
    condition: string;
    humidity: string;
  };
  stats: {
    good: number;
    strong: number;
    weak: number;
    dead: number;
  };
}

export default function WeatherScreen() {
  const { apiaries, updateWeather, updateLastVisit } = useApiaryContext();
  const [selectedApiaryId, setSelectedApiaryId] = useState('');
  const [temperature, setTemperature] = useState('20°C');
  const [condition, setCondition] = useState('Ensolarado');
  const [humidity, setHumidity] = useState('60%');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

  // Get selected apiary
  const selectedApiary = apiaries.find(a => a.id === selectedApiaryId);

  // Handle apiary selection
  const handleApiarySelect = (apiaryId: string) => {
    setSelectedApiaryId(apiaryId);
    const apiary = apiaries.find(a => a.id === apiaryId);
    if (apiary) {
      setTemperature(apiary.weather.temperature);
      setCondition(apiary.weather.condition);
      setHumidity(apiary.weather.humidity);
      setVisitDate(apiary.lastVisit);
    }
  };

  // Update weather and visit information
  const handleUpdateWeather = () => {
    if (!selectedApiaryId) {
      alert('Por favor, selecione um apiário!');
      return;
    }

    updateWeather(selectedApiaryId, temperature, condition, humidity);
    updateLastVisit(selectedApiaryId, visitDate);
    
    alert('Informações climáticas atualizadas com sucesso!');
  };

  // Weather condition options
  const weatherConditions = [
    'Ensolarado',
    'Parcialmente nublado',
    'Nublado',
    'Chuvoso',
    'Tempestade',
    'Nevoeiro',
    'Neve',
    'Vento forte'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Condições Meteorológicas</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Apiário</Text>
            <View style={styles.formSelect}>
              <Picker
                selectedValue={selectedApiaryId}
                onValueChange={(itemValue: string) => handleApiarySelect(itemValue)}
              >
                <Picker.Item label="Selecione um apiário..." value="" />
                {apiaries.map((apiaryItem: Apiary) => (
                  <Picker.Item 
                    key={apiaryItem.id} 
                    label={`${apiaryItem.name} (${apiaryItem.id})`} 
                    value={apiaryItem.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {selectedApiary && (
            <>
              <View style={styles.weatherSummary}>
                <Text style={styles.weatherSummaryTitle}>Clima Atual:</Text>
                <Text>🌡️ {selectedApiary.weather.temperature}</Text>
                <Text>☁️ {selectedApiary.weather.condition}</Text>
                <Text>💧 {selectedApiary.weather.humidity}</Text>
                <Text>📅 Última visita: {selectedApiary.lastVisit}</Text>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Data da Visita</Text>
                <TextInput
                  style={styles.formControl}
                  value={visitDate}
                  onChangeText={setVisitDate}
                  placeholder="AAAA-MM-DD"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Temperatura</Text>
                <TextInput
                  style={styles.formControl}
                  value={temperature}
                  onChangeText={setTemperature}
                  placeholder="ex: 22°C"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Condição Climática</Text>
                <View style={styles.formSelect}>
                  <Picker
                    selectedValue={condition}
                    onValueChange={(itemValue: string) => setCondition(itemValue)}
                  >
                    {weatherConditions.map((cond, index) => (
                      <Picker.Item key={index} label={cond} value={cond} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Humidade</Text>
                <TextInput
                  style={styles.formControl}
                  value={humidity}
                  onChangeText={setHumidity}
                  placeholder="ex: 65%"
                />
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={handleUpdateWeather}
                >
                  <Text style={styles.btnPrimaryText}>Atualizar Informações</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Previsão do Tempo</Text>
          <Text style={styles.weatherTip}>
            Dica: Mantenha-se informado sobre as condições climáticas para planejar melhor suas visitas aos apiários.
          </Text>
          
          <View style={styles.weatherGuide}>
            <View style={styles.weatherGuideItem}>
              <Text style={styles.weatherGuideIcon}>🐝</Text>
              <Text style={styles.weatherGuideText}>As abelhas geralmente são mais ativas em dias ensolarados com temperaturas entre 20°C e 30°C.</Text>
            </View>
            
            <View style={styles.weatherGuideItem}>
              <Text style={styles.weatherGuideIcon}>🌧️</Text>
              <Text style={styles.weatherGuideText}>Em dias chuvosos, as abelhas permanecem na colmeia. Não é recomendado visitar apiários nessas condições.</Text>
            </View>
            
            <View style={styles.weatherGuideItem}>
              <Text style={styles.weatherGuideIcon}>❄️</Text>
              <Text style={styles.weatherGuideText}>Durante o inverno, as abelhas formam um aglomerado para manter o calor. Tenha cuidado ao abrir colmeias em temperaturas muito baixas.</Text>
            </View>
            
            <View style={styles.weatherGuideItem}>
              <Text style={styles.weatherGuideIcon}>🌬️</Text>
              <Text style={styles.weatherGuideText}>Ventos fortes podem dificultar o voo das abelhas e afetar sua produtividade.</Text>
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
    alignItems: 'center',
  },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    minWidth: 200,
  },
  btnPrimaryText: {
    color: '#795548',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  weatherSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  weatherSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#795548',
  },
  weatherTip: {
    fontStyle: 'italic',
    marginBottom: 16,
    color: '#757575',
  },
  weatherGuide: {
    marginTop: 16,
  },
  weatherGuideItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  weatherGuideIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  weatherGuideText: {
    flex: 1,
    fontSize: 14,
  },
}); 