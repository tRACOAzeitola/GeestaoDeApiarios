import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useApiaryContext } from '@/context/ApiaryContext';

// Define Apiary type
interface Apiary {
  id: string;
  name: string;
  location: string;
  flora: string;
  stats: {
    good: number;
    strong: number;
    weak: number;
    dead: number;
  };
}

export default function ColmeiasScreen() {
  const { apiaries, addHives } = useApiaryContext();
  const [apiary, setApiary] = useState('');
  const [goodHives, setGoodHives] = useState('0');
  const [strongHives, setStrongHives] = useState('0');
  const [weakHives, setWeakHives] = useState('0');
  const [deadHives, setDeadHives] = useState('0');
  const [observations, setObservations] = useState('');

  const handleAddHives = () => {
    if (!apiary) {
      alert('Por favor, selecione um apiário!');
      return;
    }

    // Convert strings to numbers
    const good = parseInt(goodHives) || 0;
    const strong = parseInt(strongHives) || 0;
    const weak = parseInt(weakHives) || 0;
    const dead = parseInt(deadHives) || 0;

    if (good + strong + weak + dead === 0) {
      alert('Por favor, adicione pelo menos uma colmeia!');
      return;
    }

    // Add hives through context
    addHives(apiary, good, strong, weak, dead, observations);
    
    alert('Colmeias adicionadas com sucesso!');
    
    // Reset form
    setApiary('');
    setGoodHives('0');
    setStrongHives('0');
    setWeakHives('0');
    setDeadHives('0');
    setObservations('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adicionar Colmeias em Lote</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Apiário</Text>
              <View style={styles.formSelect}>
                <Picker
                  selectedValue={apiary}
                  onValueChange={(itemValue: string) => setApiary(itemValue)}
                >
                  <Picker.Item label="Selecione..." value="" />
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
            
            <Text style={styles.formLabel}>Quantidade de Colmeias por Estado</Text>
            <View style={styles.hiveCounts}>
              <View style={styles.countItem}>
                <Text style={styles.countLabel}>Boas (1 pedra ao meio)</Text>
                <TextInput
                  style={styles.countInput}
                  keyboardType="numeric"
                  value={goodHives}
                  onChangeText={setGoodHives}
                />
              </View>
              
              <View style={styles.countItem}>
                <Text style={styles.countLabel}>Fortes (2 pedras ao meio)</Text>
                <TextInput
                  style={styles.countInput}
                  keyboardType="numeric"
                  value={strongHives}
                  onChangeText={setStrongHives}
                />
              </View>
              
              <View style={styles.countItem}>
                <Text style={styles.countLabel}>Fracas (1 pedra à esquerda)</Text>
                <TextInput
                  style={styles.countInput}
                  keyboardType="numeric"
                  value={weakHives}
                  onChangeText={setWeakHives}
                />
              </View>
              
              <View style={styles.countItem}>
                <Text style={styles.countLabel}>Mortas (1 pau ao meio)</Text>
                <TextInput
                  style={styles.countInput}
                  keyboardType="numeric"
                  value={deadHives}
                  onChangeText={setDeadHives}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Observações</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Adicione detalhes sobre as colmeias..."
                value={observations}
                onChangeText={setObservations}
              />
            </View>
            
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnPrimary}
                onPress={handleAddHives}
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
  formSelect: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  hiveCounts: {
    marginBottom: 16,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  countLabel: {
    flex: 1,
    marginRight: 16,
  },
  countInput: {
    width: 80,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
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