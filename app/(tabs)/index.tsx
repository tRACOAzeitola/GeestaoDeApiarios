import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import Theme from '../../constants/Theme';
import { VictoryPie } from 'victory-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { apiaries, totalApiaries, totalHives, hivesData, urgentHives } = useApiaryContext();
  
  // Status color mapping for the charts
  const statusColorMap: { [key: string]: string } = {
    'Boas': Theme.COLORS.status.good,
    'Fortes': Theme.COLORS.status.strong,
    'Fracas': Theme.COLORS.status.weak,
    'Mortas': Theme.COLORS.status.dead
  };

  // Calculate most recent apiary by last visit
  const getMostRecentApiaries = () => {
    return [...apiaries].sort((a, b) => 
      new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    );
  };

  const recentApiaries = getMostRecentApiaries();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalApiaries()}</Text>
            <Text style={styles.summaryLabel}>Total de Apiários</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalHives()}</Text>
            <Text style={styles.summaryLabel}>Total de Colmeias</Text>
          </View>
        </View>

        {/* Legenda */}
        <View style={styles.legendaContainer}>
          <Text style={styles.sectionTitle}>Sistema de Classificação</Text>
          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🪨</Text>
              <Text style={styles.legendaText}>1 pedra ao meio - Colmeia boa</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🪨🪨</Text>
              <Text style={styles.legendaText}>2 pedras ao meio - Colmeia forte</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>↖️🪨</Text>
              <Text style={styles.legendaText}>1 pedra à esquerda - Colmeia fraca</Text>
            </View>
            <View style={styles.legendaItem}>
              <Text style={styles.legendaIcon}>🥢</Text>
              <Text style={styles.legendaText}>1 pau ao meio - Colmeia morta</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição de Colmeias</Text>
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
                  fill: Theme.COLORS.text.primary,
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
            <Text style={styles.sectionTitle}>Apiários Recentes</Text>
            {recentApiaries.slice(0, 2).map((apiary) => (
              <View key={apiary.id} style={styles.apiaryCard}>
                <View style={styles.apiaryHeader}>
                  <Text style={styles.apiaryTitle}>{apiary.name} ({apiary.id})</Text>
                  <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.apiaryInfo}>Localização: {apiary.location}</Text>
                <Text style={styles.apiaryInfo}>Flora: {apiary.flora}</Text>
                <View style={styles.weatherInfo}>
                  <Ionicons 
                    name={apiary.weather.condition.toLowerCase().includes('sol') ? 'sunny' : 'cloudy'} 
                    size={18} 
                    color={Theme.COLORS.primary.default} 
                  />
                  <Text style={styles.weatherText}>
                    {apiary.weather.temperature}, {apiary.weather.condition}
                  </Text>
                </View>
                <Text style={styles.lastVisitText}>Última visita: {apiary.lastVisit}</Text>
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
            <Text style={styles.sectionTitle}>Colmeias que Necessitam Atenção</Text>
            {urgentHives.map((hive) => (
              <View key={hive.id} style={styles.urgentCard}>
                <View style={styles.urgentInfo}>
                  <Text style={styles.urgentApiary}>{hive.apiary}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusIndicator, styles[`status${hive.status}`]]} />
                    <Text style={styles.urgentStatus}>
                      {hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.urgentQuantity}>Quantidade: {hive.quantity}</Text>
                  <Text style={styles.urgentAction}>Ação: {hive.action}</Text>
                </View>
                <TouchableOpacity style={styles.attendButton}>
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
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...Theme.SHADOWS.light,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.COLORS.secondary.default,
  },
  summaryLabel: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Theme.COLORS.text.primary,
  },
  legendaContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...Theme.SHADOWS.light,
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
    color: Theme.COLORS.text.secondary,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...Theme.SHADOWS.light,
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
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...Theme.SHADOWS.light,
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
    color: Theme.COLORS.text.primary,
  },
  detailsButton: {
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.COLORS.secondary.default,
  },
  detailsButtonText: {
    fontSize: 12,
    color: Theme.COLORS.secondary.default,
  },
  apiaryInfo: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
    marginBottom: 4,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  weatherText: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
    marginLeft: 8,
  },
  lastVisitText: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
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
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Theme.SHADOWS.light,
  },
  urgentInfo: {
    flex: 1,
  },
  urgentApiary: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.COLORS.text.primary,
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
    backgroundColor: Theme.COLORS.status.good,
  },
  statusforte: {
    backgroundColor: Theme.COLORS.status.strong,
  },
  statusfraca: {
    backgroundColor: Theme.COLORS.status.weak,
  },
  statusmorta: {
    backgroundColor: Theme.COLORS.status.dead,
  },
  urgentStatus: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
  },
  urgentQuantity: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
    marginBottom: 2,
  },
  urgentAction: {
    fontSize: 14,
    color: Theme.COLORS.text.secondary,
  },
  attendButton: {
    backgroundColor: Theme.COLORS.primary.default,
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
