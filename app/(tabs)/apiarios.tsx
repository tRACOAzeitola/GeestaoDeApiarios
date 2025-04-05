import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ApiaryScreen() {
  const { apiaries, addApiary } = useApiaryContext();
  const { theme, isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [apiaryId, setApiaryId] = useState('');
  const [apiaryName, setApiaryName] = useState('');
  const [location, setLocation] = useState('');
  const [floraType, setFloraType] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddApiary = () => {
    setError(null);
    
    // Validation
    if (!apiaryId.trim()) {
      setError('ID do apiário é obrigatório');
      return;
    }
    if (!apiaryName.trim()) {
      setError('Nome do apiário é obrigatório');
      return;
    }
    if (!floraType.trim()) {
      setError('Tipo de flora é obrigatório');
      return;
    }

    // Check for duplicate ID
    if (apiaries.some(a => a.id === apiaryId)) {
      setError('Este ID de apiário já existe');
      return;
    }

    // Add new apiary
    addApiary({
      id: apiaryId,
      name: apiaryName,
      location: location || 'Não especificado',
      flora: floraType,
      lastVisit: new Date().toLocaleDateString('pt-BR'),
      stats: { good: 0, strong: 0, weak: 0, dead: 0 },
      weather: { 
        temperature: '25°C', 
        condition: 'Ensolarado',
        humidity: '60%'
      }
    });

    // Reset form
    setApiaryId('');
    setApiaryName('');
    setLocation('');
    setFloraType('');
    setShowForm(false);
    
    Alert.alert('Sucesso', 'Apiário adicionado com sucesso!');
  };

  const cancelForm = () => {
    setApiaryId('');
    setApiaryName('');
    setLocation('');
    setFloraType('');
    setError(null);
    setShowForm(false);
  };

  const renderApiary = ({ item }) => (
    <View style={[styles.apiaryCard, { backgroundColor: theme.COLORS.surface.light }]}>
      {/* Cabeçalho do Apiário */}
      <View style={[styles.apiaryHeaderBanner, { backgroundColor: theme.COLORS.accent.default }]}>
        <Text style={styles.apiaryHeaderTitle}>
          {item.name} ({item.id})
        </Text>
        <Text style={styles.apiaryHeaderSubtitle}>
          Última visita: {item.lastVisit}
        </Text>
      </View>
      
      {/* Informações de Localização e Flora */}
      <View style={styles.apiaryInfoSection}>
        <Text style={[styles.apiaryInfo, { color: theme.COLORS.text.secondary }]}>
          Localização: {item.location}
        </Text>
        <Text style={[styles.apiaryInfo, { color: theme.COLORS.text.secondary }]}>
          Flora: {item.flora}
        </Text>
      </View>
      
      {/* Status das Colmeias */}
      <View style={styles.apiaryStatsContainer}>
        {/* Gráfico de Status */}
        <View style={styles.apiaryStatsChart}>
          <Text style={[styles.apiaryStatsTitle, { color: theme.COLORS.text.primary }]}>
            Status das Colmeias
          </Text>
          <View style={styles.pieChartContainer}>
            <View style={styles.pieChart}>
              {/* Segmentos do gráfico de pizza simplificado */}
              <View 
                style={[
                  styles.pieChartSegment, 
                  { 
                    backgroundColor: theme.COLORS.status.good,
                    height: '50%',
                    width: '50%',
                    borderTopLeftRadius: 40
                  }
                ]} 
              />
              <View 
                style={[
                  styles.pieChartSegment, 
                  { 
                    backgroundColor: theme.COLORS.status.strong,
                    height: '50%',
                    width: '50%',
                    borderTopRightRadius: 40
                  }
                ]} 
              />
              <View 
                style={[
                  styles.pieChartSegment, 
                  { 
                    backgroundColor: theme.COLORS.status.weak,
                    height: '50%',
                    width: '50%',
                    borderBottomLeftRadius: 40
                  }
                ]} 
              />
              <View 
                style={[
                  styles.pieChartSegment, 
                  { 
                    backgroundColor: theme.COLORS.status.dead,
                    height: '50%',
                    width: '50%',
                    borderBottomRightRadius: 40
                  }
                ]} 
              />
              
              {/* Total de colmeias no centro */}
              <View style={styles.pieChartTotal}>
                <Text style={styles.pieChartTotalText}>
                  {item.stats.good + item.stats.strong + item.stats.weak + item.stats.dead}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Detalhes do Status */}
        <View style={styles.apiaryStatsDetails}>
          <Text style={[styles.apiaryStatsTitle, { color: theme.COLORS.text.primary }]}>
            Detalhes
          </Text>
          <View style={styles.statusDetailsList}>
            <View style={styles.statusDetailItem}>
              <View style={[styles.statusDot, { backgroundColor: theme.COLORS.status.strong }]} />
              <Text style={[styles.statusDetailText, { color: theme.COLORS.text.primary }]}>
                {item.stats.strong} Fortes
              </Text>
            </View>
            <View style={styles.statusDetailItem}>
              <View style={[styles.statusDot, { backgroundColor: theme.COLORS.status.good }]} />
              <Text style={[styles.statusDetailText, { color: theme.COLORS.text.primary }]}>
                {item.stats.good} Boas
              </Text>
            </View>
            <View style={styles.statusDetailItem}>
              <View style={[styles.statusDot, { backgroundColor: theme.COLORS.status.weak }]} />
              <Text style={[styles.statusDetailText, { color: theme.COLORS.text.primary }]}>
                {item.stats.weak} Fracas
              </Text>
            </View>
            <View style={styles.statusDetailItem}>
              <View style={[styles.statusDot, { backgroundColor: theme.COLORS.status.dead }]} />
              <Text style={[styles.statusDetailText, { color: theme.COLORS.text.primary }]}>
                {item.stats.dead} Mortas
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Botões de Ação */}
      <View style={styles.apiaryActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => {}}
        >
          <Text style={styles.detailsButtonText}>Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.visitButton, { backgroundColor: theme.COLORS.success.default }]}
          onPress={() => {}}
        >
          <Text style={styles.visitButtonText}>Visitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.COLORS.primary.default }]}>
        <Text style={styles.headerTitle}>Meus Apiários</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.COLORS.accent.default }]} 
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name={showForm ? "close" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {showForm ? (
        <View style={[styles.formContainer, { backgroundColor: theme.COLORS.surface.light }]}>
          <Text style={[styles.formTitle, { color: theme.COLORS.text.primary }]}>Adicionar Novo Apiário</Text>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.COLORS.text.secondary }]}>ID do Apiário</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? theme.COLORS.surface.dark : theme.COLORS.surface.lighter,
                color: theme.COLORS.text.primary,
                borderColor: theme.COLORS.border.default
              }]}
              value={apiaryId}
              onChangeText={setApiaryId}
              placeholder="Ex: AP001"
              placeholderTextColor={theme.COLORS.text.disabled}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.COLORS.text.secondary }]}>Nome do Apiário</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? theme.COLORS.surface.dark : theme.COLORS.surface.lighter,
                color: theme.COLORS.text.primary,
                borderColor: theme.COLORS.border.default
              }]}
              value={apiaryName}
              onChangeText={setApiaryName}
              placeholder="Ex: Apiário Central"
              placeholderTextColor={theme.COLORS.text.disabled}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.COLORS.text.secondary }]}>Localização</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? theme.COLORS.surface.dark : theme.COLORS.surface.lighter,
                color: theme.COLORS.text.primary,
                borderColor: theme.COLORS.border.default
              }]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Fazenda Vista Alegre"
              placeholderTextColor={theme.COLORS.text.disabled}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.COLORS.text.secondary }]}>Tipo de Flora</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? theme.COLORS.surface.dark : theme.COLORS.surface.lighter,
                color: theme.COLORS.text.primary,
                borderColor: theme.COLORS.border.default
              }]}
              value={floraType}
              onChangeText={setFloraType}
              placeholder="Ex: Eucalipto, Laranjeira"
              placeholderTextColor={theme.COLORS.text.disabled}
            />
          </View>
          
          <View style={styles.formButtons}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: theme.COLORS.error.default }]} 
              onPress={cancelForm}
            >
              <Text style={[styles.cancelButtonText, { color: theme.COLORS.error.default }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.COLORS.success.default }]} 
              onPress={handleAddApiary}
            >
              <Text style={styles.submitButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {apiaries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={64} color={theme.COLORS.text.disabled} />
              <Text style={[styles.emptyText, { color: theme.COLORS.text.secondary }]}>
                Nenhum apiário cadastrado
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.COLORS.text.disabled }]}>
                Adicione seu primeiro apiário clicando no botão +
              </Text>
            </View>
          ) : (
            <FlatList
              data={apiaries}
              renderItem={renderApiary}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  apiaryCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  apiaryHeaderBanner: {
    padding: 16,
    paddingBottom: 12,
  },
  apiaryHeaderTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  apiaryHeaderSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  apiaryInfoSection: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  apiaryInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  apiaryStatsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  apiaryStatsChart: {
    flex: 1,
    alignItems: 'center',
  },
  apiaryStatsDetails: {
    flex: 1,
    paddingLeft: 12,
  },
  apiaryStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  pieChartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pieChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  pieChartSegment: {
    position: 'absolute',
  },
  pieChartTotal: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDetailsList: {
    width: '100%',
  },
  statusDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDetailText: {
    fontSize: 14,
  },
  apiaryActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0,0,0,0.05)',
  },
  visitButton: {
    backgroundColor: '#4CAF50',
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(0,0,0,0.05)',
  },
  detailsButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  visitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
  },
}); 