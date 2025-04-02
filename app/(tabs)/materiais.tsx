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

export default function MateriaisScreen() {
  const { apiaries, addMaterial } = useApiaryContext();
  const [apiary, setApiary] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleAddMaterial = () => {
    if (!apiary || !materialType) {
      alert('Por favor, preencha os campos obrigatórios!');
      return;
    }

    // Convert string to number
    const quantityNum = parseInt(quantity) || 1;

    // Add material through context
    addMaterial({
      apiary,
      type: materialType,
      quantity: quantityNum
    });
    
    alert('Material adicionado com sucesso!');
    
    // Reset form
    setApiary('');
    setMaterialType('');
    setQuantity('1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adicionar Material</Text>
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
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tipo de Material</Text>
              <View style={styles.formSelect}>
                <Picker
                  selectedValue={materialType}
                  onValueChange={(itemValue: string) => setMaterialType(itemValue)}
                >
                  <Picker.Item label="Selecione..." value="" />
                  <Picker.Item label="Alça" value="alca" />
                  <Picker.Item label="Colmeia Reversível" value="colmeia_reversivel" />
                  <Picker.Item label="Colmeia Lusitana" value="colmeia_lusitana" />
                  <Picker.Item label="Alimentadores" value="alimentadores" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Quantidade</Text>
              <TextInput
                style={styles.formControl}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnPrimary}
                onPress={handleAddMaterial}
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