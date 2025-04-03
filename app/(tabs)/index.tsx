import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import { useTheme } from '../../context/ThemeContext';
import { VictoryPie } from 'victory-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { apiaries, totalApiaries, totalHives, hivesData, urgentHives } = useApiaryContext();
  const { theme, isDarkMode } = useTheme();
  
  // Status color mapping for the charts
  const statusColorMap: { [key: string]: string } = {
    'Boas': theme.COLORS.status.good,
    'Fortes': theme.COLORS.status.strong,
    'Fracas': theme.COLORS.status.weak,
    'Mortas': theme.COLORS.status.dead
  };

  // Calculate most recent apiary by last visit
  const getMostRecentApiaries = () => {
    return [...apiaries].sort((a, b) => 
      new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    );
  };

  const recentApiaries = getMostRecentApiaries();

  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.COLORS.primary.default }]}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={[styles.summaryContainer, { backgroundColor: theme.COLORS.surface.light }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: theme.COLORS.secondary.default }]}>{totalApiaries()}</Text>
            <Text style={[styles.summaryLabel, { color: theme.COLORS.text.secondary }]}>Total de Apiários</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: theme.COLORS.secondary.default }]}>{totalHives()}</Text>
            <Text style={[styles.summaryLabel, { color: theme.COLORS.text.secondary }]}>Total de Colmeias</Text>
          </View>
        </View>

        {/* Legenda */}
        <View style={[styles.legendaContainer, { backgroundColor: theme.COLORS.surface.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.COLORS.text.primary }]}>Sistema de Classificação</Text>
          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🪨</Text>
              <Text style={[styles.legendaText, { color: theme.COLORS.text.secondary }]}>1 pedra ao meio - Colmeia boa</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🪨🪨</Text>
              <Text style={[styles.legendaText, { color: theme.COLORS.text.secondary }]}>2 pedras ao meio - Colmeia forte</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>↖️🪨</Text>
              <Text style={[styles.legendaText, { color: theme.COLORS.text.secondary }]}>1 pedra à esquerda - Colmeia fraca</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🥢</Text>
              <Text style={[styles.legendaText, { color: theme.COLORS.text.secondary }]}>1 pau ao meio - Colmeia morta</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.COLORS.surface.light }]}>
          <Text style={[styles.sectionTitle, { color: theme.COLORS.text.primary }]}>Distribuição de Colmeias</Text>
          <View style={styles.chartContent}>
            <VictoryPie
              data={hivesData()}
              x="status"
              y="count"
              colorScale={hivesData().map(item => statusColorMap[item.status])}
              innerRadius={30}
              labelRadius={30}
              style={{
                labels: {
                  fill: theme.COLORS.text.primary,
                  fontSize: 12,
                  fontWeight: 'bold'
                }
              }}
            />
          </View>
        </View>

        {/* Recent Apiaries */}
        {recentApiaries.length > 0 && (
          <View style={styles.apiariesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.COLORS.text.primary }]}>Apiários Recentes</Text>
            {recentApiaries.slice(0, 2).map((apiary) => (
              <View key={apiary.id} style={[styles.apiaryCard, { backgroundColor: theme.COLORS.surface.light }]}>
                <View style={styles.apiaryHeader}>
                  <Text style={[styles.apiaryTitle, { color: theme.COLORS.text.primary }]}>
                    {apiary.name} ({apiary.id})
                  </Text>
                  <TouchableOpacity 
                    style={[styles.detailsButton, { borderColor: theme.COLORS.secondary.default }]}
                  >
                    <Text style={[styles.detailsButtonText, { color: theme.COLORS.secondary.default }]}>
                      Detalhes
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.apiaryInfo, { color: theme.COLORS.text.secondary }]}>
                  Localização: {apiary.location}
                </Text>
                <Text style={[styles.apiaryInfo, { color: theme.COLORS.text.secondary }]}>
                  Flora: {apiary.flora}
                </Text>
                <View style={styles.weatherInfo}>
                  <Ionicons 
                    name={apiary.weather.condition.toLowerCase().includes('sol') ? 'sunny' : 'cloudy'} 
                    size={18} 
                    color={theme.COLORS.primary.default} 
                  />
                  <Text style={[styles.weatherText, { color: theme.COLORS.text.secondary }]}>
                    {apiary.weather.temperature}, {apiary.weather.condition}
                  </Text>
                </View>
                <Text style={[styles.lastVisitText, { color: theme.COLORS.text.secondary }]}>
                  Última visita: {apiary.lastVisit}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBox, styles.statusGood]}>
                    <Text style={styles.statusValue}>{apiary.stats.good}</Text>
                    <Text style={styles.statusLabel}>Boas</Text>
                  </View>
                  <View style={[styles.statusBox, styles.statusStrong]}>
                    <Text style={styles.statusValue}>{apiary.stats.strong}</Text>
                    <Text style={styles.statusLabel}>Fortes</Text>
                  </View>
                  <View style={[styles.statusBox, styles.statusWeak]}>
                    <Text style={styles.statusValue}>{apiary.stats.weak}</Text>
                    <Text style={styles.statusLabel}>Fracas</Text>
                  </View>
                  <View style={[styles.statusBox, styles.statusDead]}>
                    <Text style={styles.statusValue}>{apiary.stats.dead}</Text>
                    <Text style={styles.statusLabel}>Mortas</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Urgent Hives */}
        {urgentHives.length > 0 && (
          <View style={styles.urgentContainer}>
            <Text style={[styles.sectionTitle, { color: theme.COLORS.text.primary }]}>Colmeias que Necessitam Atenção</Text>
            {urgentHives.map((hive) => (
              <View key={hive.id} style={[styles.urgentCard, { backgroundColor: theme.COLORS.surface.light }]}>
                <View style={styles.urgentInfo}>
                  <Text style={[styles.urgentApiary, { color: theme.COLORS.text.primary }]}>{hive.apiary}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusIndicator, styles[`status${hive.status}`]]} />
                    <Text style={[styles.urgentStatus, { color: theme.COLORS.text.secondary }]}>
                      {hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}
                    </Text>
                  </View>
                  <Text style={[styles.urgentQuantity, { color: theme.COLORS.text.secondary }]}>
                    Quantidade: {hive.quantity}
                  </Text>
                  <Text style={[styles.urgentAction, { color: theme.COLORS.text.secondary }]}>
                    Ação: {hive.action}
                  </Text>
                </View>
                <TouchableOpacity style={[styles.attendButton, { backgroundColor: theme.COLORS.primary.default }]}>
                  <Text style={styles.attendButtonText}>Atender</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendaContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  legenda: {
    flexDirection: 'column',
    gap: 8,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendaIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  legendaText: {
    fontSize: 14,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  chartContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  apiariesContainer: {
    marginBottom: 16,
  },
  apiaryCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  apiaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsButton: {
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  detailsButtonText: {
    fontSize: 12,
  },
  apiaryInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  weatherText: {
    fontSize: 14,
    marginLeft: 8,
  },
  lastVisitText: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBox: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  statusGood: {
    backgroundColor: '#E6F4EA',
  },
  statusStrong: {
    backgroundColor: '#E3F2FD',
  },
  statusWeak: {
    backgroundColor: '#FFF3E0',
  },
  statusDead: {
    backgroundColor: '#FFEBEE',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
  },
  urgentContainer: {
    marginBottom: 16,
  },
  urgentCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgentInfo: {
    flex: 1,
  },
  urgentApiary: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusboa: {
    backgroundColor: '#4CAF50',
  },
  statusforte: {
    backgroundColor: '#2196F3',
  },
  statusfraca: {
    backgroundColor: '#FF9800',
  },
  statusmorta: {
    backgroundColor: '#F44336',
  },
  urgentStatus: {
    fontSize: 14,
  },
  urgentQuantity: {
    fontSize: 14,
    marginBottom: 2,
  },
  urgentAction: {
    fontSize: 14,
  },
  attendButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  attendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
