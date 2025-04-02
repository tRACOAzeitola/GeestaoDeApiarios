import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApiaryContext } from '@/context/ApiaryContext';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

// Import the Apiary type from context
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

interface Hive {
  id: number;
  apiary: string;
  status: 'boa' | 'forte' | 'fraca' | 'morta';
  quantity: number;
  action: string;
}

interface ChartDataItem {
  status: string;
  count: number;
  x?: number;
  y?: number;
}

export default function DashboardScreen() {
  const { apiaries, urgentHives, attendHive, totalApiaries, totalHives, hivesData } = useApiaryContext();
  
  const screenWidth = Dimensions.get('window').width - 40;
  const chartData = hivesData();
  
  // Find apiary with most recent visit
  const getLastVisitedApiary = () => {
    if (apiaries.length === 0) return null;
    
    return apiaries.reduce((latest, current) => {
      const latestDate = new Date(latest.lastVisit);
      const currentDate = new Date(current.lastVisit);
      return currentDate > latestDate ? current : latest;
    }, apiaries[0]);
  };
  
  const lastVisitedApiary = getLastVisitedApiary();

  const handleAttendHive = (hiveId: number) => {
    attendHive(hiveId);
    alert(`Atendendo colmeia ${hiveId}`);
  };

  const handleApiaryDetails = (apiaryId: string) => {
    // This would navigate to apiary details
    alert(`Detalhes do apiário ${apiaryId}`);
  };

  const pieColors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];
  
  // Define status color map
  const statusColorMap: Record<string, string> = {
    'Boas': '#4CAF50',
    'Fortes': '#2196F3',
    'Fracas': '#FF9800',
    'Mortas': '#F44336'
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Dashboard Summary */}
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
        
        {/* Last Visit Info */}
        {lastVisitedApiary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Última Visita</Text>
            <Text style={styles.visitInfo}>
              {lastVisitedApiary.name} ({lastVisitedApiary.id}) - {lastVisitedApiary.lastVisit}
            </Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherItem}>🌡️ {lastVisitedApiary.weather.temperature}</Text>
              <Text style={styles.weatherItem}>☁️ {lastVisitedApiary.weather.condition}</Text>
              <Text style={styles.weatherItem}>💧 {lastVisitedApiary.weather.humidity}</Text>
            </View>
          </View>
        )}
        
        {/* Charts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribuição de Colmeias</Text>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={chartData}
              x="status"
              y="count"
              width={screenWidth}
              height={200}
              padding={{ top: 20, bottom: 60 }}
              colorScale={pieColors}
              style={{ 
                labels: { 
                  fill: '#212121', 
                  fontSize: 12, 
                  padding: 10 
                } 
              }}
              labelRadius={30}
              innerRadius={30}
            />
          </View>
          
          <Text style={styles.cardTitle}>Comparação de Colmeias</Text>
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              width={screenWidth}
              height={250}
            >
              <VictoryAxis
                tickValues={[1, 2, 3, 4]}
                tickFormat={["Boas", "Fortes", "Fracas", "Mortas"]}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 }
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x: number) => (`${x}`)}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 }
                }}
              />
              <VictoryBar
                data={chartData.map((item: ChartDataItem, index) => ({ ...item, x: index + 1, y: item.count }))}
                style={{ 
                  data: { 
                    fill: ({ datum }) => {
                      const status = datum.status || '';
                      return statusColorMap[status] || '#795548';
                    } 
                  } 
                }}
              />
            </VictoryChart>
          </View>
        </View>
        
        {/* Legenda */}
        <View style={styles.legendaContainer}>
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
        
        {/* Apiários Dashboard Cards */}
        <View style={styles.dashboard}>
          {apiaries.map((apiary: Apiary) => (
            <View key={apiary.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{apiary.name} ({apiary.id})</Text>
                <TouchableOpacity 
                  style={styles.btnOutline}
                  onPress={() => handleApiaryDetails(apiary.id)}
                >
                  <Text style={styles.btnOutlineText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
              <Text>Localização: {apiary.location}</Text>
              <Text>Flora: {apiary.flora}</Text>
              <Text>Última Visita: {apiary.lastVisit}</Text>
              <View style={styles.weatherBar}>
                <Text>🌡️ {apiary.weather.temperature}</Text>
                <Text>☁️ {apiary.weather.condition}</Text>
                <Text>💧 {apiary.weather.humidity}</Text>
              </View>
              <View style={styles.apiarioStats}>
                <View style={[styles.statBox, styles.statBoxBoa]}>
                  <Text style={styles.statValue}>{apiary.stats.good}</Text>
                  <Text style={styles.statLabel}>Boas</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxForte]}>
                  <Text style={styles.statValue}>{apiary.stats.strong}</Text>
                  <Text style={styles.statLabel}>Fortes</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxFraca]}>
                  <Text style={styles.statValue}>{apiary.stats.weak}</Text>
                  <Text style={styles.statLabel}>Fracas</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxMorta]}>
                  <Text style={styles.statValue}>{apiary.stats.dead}</Text>
                  <Text style={styles.statLabel}>Mortas</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Colmeias que Necessitam Atenção */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Colmeias que Necessitam Atenção</Text>
          {urgentHives.length > 0 ? (
            urgentHives.map((hive: Hive) => (
              <View key={hive.id} style={styles.hiveRow}>
                <View style={styles.hiveInfo}>
                  <Text style={styles.hiveApiary}>{hive.apiary}</Text>
                  <View style={styles.hiveStatusContainer}>
                    <View style={[
                      styles.statusIndicator, 
                      hive.status === 'forte' ? styles.statusForte : 
                      hive.status === 'fraca' ? styles.statusFraca : 
                      hive.status === 'morta' ? styles.statusMorta : null
                    ]} />
                    <Text>{hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}</Text>
                  </View>
                  <Text style={styles.hiveQuantity}>Quant. {hive.quantity}</Text>
                  <Text style={styles.hiveAction}>{hive.action}</Text>
                  <TouchableOpacity 
                    style={styles.btnPrimary}
                    onPress={() => handleAttendHive(hive.id)}
                  >
                    <Text style={styles.btnPrimaryText}>Atender</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noHivesMessage}>Não há colmeias que necessitam atenção no momento.</Text>
          )}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#795548',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  visitInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 8,
  },
  weatherItem: {
    fontSize: 14,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  weatherBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  legendaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    margin: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  legendaIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  legendaText: {
    fontSize: 14,
  },
  dashboard: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#795548',
    marginBottom: 8,
  },
  apiarioStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    minWidth: 80,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  statBoxBoa: {
    backgroundColor: '#E6F4EA',
  },
  statBoxForte: {
    backgroundColor: '#E3F2FD',
  },
  statBoxFraca: {
    backgroundColor: '#FFF3E0',
  },
  statBoxMorta: {
    backgroundColor: '#FFEBEE',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  hiveRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  hiveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  hiveApiary: {
    flex: 3,
    marginRight: 8,
  },
  hiveStatusContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusForte: {
    backgroundColor: '#2196F3',
  },
  statusFraca: {
    backgroundColor: '#FF9800',
  },
  statusMorta: {
    backgroundColor: '#F44336',
  },
  hiveQuantity: {
    flex: 1,
    textAlign: 'center',
  },
  hiveAction: {
    flex: 4,
  },
  btnOutline: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#795548',
  },
  btnOutlineText: {
    color: '#795548',
    fontWeight: '500',
    fontSize: 14,
  },
  btnPrimary: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  btnPrimaryText: {
    color: '#795548',
    fontWeight: '500',
    fontSize: 14,
  },
  noHivesMessage: {
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
    color: '#757575',
  },
});
