import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useApiaryContext } from '../../context/ApiaryContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { AnimatedText } from '../../components/ui/AnimatedText';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { InteractiveChart } from '../../components/ui/InteractiveChart';
import { StatCard } from '../../components/ui/StatCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const { apiaries, totalApiaries, totalHives, hivesData, urgentHives } = useApiaryContext();
  const { theme, isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Adaptando hivesData para o formato do InteractiveChart
  const chartData = hivesData().map(item => ({
    id: item.status.toLowerCase(),
    label: item.status,
    value: item.count,
    color: getStatusColor(item.status, theme),
    icon: getIconForStatus(item.status)
  }));
  
  // Filtra os dados do gráfico quando uma categoria é selecionada
  const filteredChartData = selectedCategory
    ? chartData.filter(item => item.id === selectedCategory.toLowerCase())
    : chartData;
    
  console.log("Dados do gráfico:", chartData.map(item => `${item.label}: ${item.value}`).join(", "));
  console.log("Dados filtrados:", filteredChartData.map(item => `${item.label}: ${item.value}`).join(", "));
  
  // Forçar o uso do gráfico completo quando não houver seleção
  React.useEffect(() => {
    if (!selectedCategory && filteredChartData.length !== chartData.length) {
      console.log("Corrigindo dados do gráfico para mostrar todas as categorias");
      // Garantir que todos os dados sejam mostrados
      setSelectedCategory(null);
    }
  }, [selectedCategory, filteredChartData, chartData]);
  
  function getStatusColor(status: string, theme: any): string {
    switch (status.toLowerCase()) {
      case 'boas': return theme.COLORS.status.good;
      case 'fortes': return theme.COLORS.status.strong;
      case 'fracas': return theme.COLORS.status.weak;
      case 'mortas': return theme.COLORS.status.dead;
      default: return theme.COLORS.primary.default;
    }
  }
  
  function getIconForStatus(status: string): React.ComponentProps<typeof Ionicons>['name'] {
    switch (status.toLowerCase()) {
      case 'boas': return 'checkmark-circle-outline';
      case 'fortes': return 'star-outline';
      case 'fracas': return 'alert-circle-outline';
      case 'mortas': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  }

  // Calculate most recent apiary by last visit
  const getMostRecentApiaries = () => {
    return [...apiaries].sort((a, b) => 
      new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    );
  };

  const recentApiaries = getMostRecentApiaries();
  const isSmallScreen = SCREEN_WIDTH < 360;

  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.COLORS.primary.default }]}>
        <AnimatedText 
          text="Dashboard" 
          style={styles.headerTitle} 
          animationType="slide" 
          duration={800}
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Resumo de Estatísticas */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total de Apiários"
            value={totalApiaries()}
            icon="flower"
            color={theme.COLORS.secondary.default}
            delay={100}
          />
          <StatCard
            title="Total de Colmeias"
            value={totalHives()}
            icon="grid"
            color={theme.COLORS.primary.default}
            delay={200}
          />
          <StatCard
            title="Colmeias Urgentes"
            value={urgentHives.length}
            icon="alert-circle"
            color={theme.COLORS.status.weak}
            trend={{
              value: 10,
              direction: 'up',
              label: 'vs. mês anterior'
            }}
            delay={300}
          />
        </View>

        {/* Gráfico Interativo - Distribuição de Colmeias */}
        <AnimatedCard animationType="fade" delay={400}>
          <View style={styles.sectionHeader}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold',
              color: theme.COLORS.text.primary 
            }}>
              Distribuição de Colmeias
            </Text>
            
            <View style={styles.chartControls}>
              <TouchableOpacity 
                style={[
                  styles.chartTypeButton,
                  { backgroundColor: theme.COLORS.primary.light }
                ]}
                onPress={() => {}}
              >
                <Ionicons 
                  name={isSmallScreen ? "bar-chart" : "pie-chart"} 
                  size={16} 
                  color={theme.COLORS.primary.default} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {/* Gráfico principal */}
            <View style={styles.chartWrapper}>
              {selectedCategory && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    // Garantir que voltamos para a visão completa
                    setSelectedCategory(null);
                    console.log('Resetando para visão completa');
                  }}
                >
                  <Ionicons name="close-circle" size={24} color={theme.COLORS.text.secondary} />
                  <Text style={{ marginLeft: 8, color: theme.COLORS.text.secondary }}>Voltar à visão completa</Text>
                </TouchableOpacity>
              )}
              <InteractiveChart 
                data={filteredChartData}
                type={isSmallScreen ? 'bar' : 'donut'}
                showLegend={false}
                onItemPress={(item) => {
                  if (selectedCategory === item.id) {
                    // Se clicar no mesmo item novamente, desseleciona
                    setSelectedCategory(null);
                  } else {
                    // Seleciona o item clicado
                    setSelectedCategory(item.id);
                  }
                }}
              />
            </View>
            
            {/* Legenda do gráfico */}
            <View style={styles.legendContainer}>
              <View style={styles.totalContainer}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: 'bold',
                  color: theme.COLORS.text.secondary 
                }}>
                  Total
                </Text>
                <Text style={{ 
                  fontSize: 36, 
                  fontWeight: 'bold',
                  color: theme.COLORS.primary.default
                }}>
                  {selectedCategory 
                    ? chartData.find(item => item.id === selectedCategory.toLowerCase())?.value || 0
                    : totalHives()}
                </Text>
              </View>
              
              <View style={styles.legendItems}>
                {hivesData().map((item) => {
                  const statusColor = getStatusColor(item.status, theme);
                  const percentage = Math.round((item.count / totalHives()) * 100);
                  const isSelected = selectedCategory?.toLowerCase() === item.status.toLowerCase();
                  
                  return (
                    <TouchableOpacity 
                      key={item.status} 
                      style={[
                        styles.legendItem,
                        isSelected && { 
                          backgroundColor: `${statusColor}22`,
                          borderRadius: 8,
                          borderLeftWidth: 3,
                          borderLeftColor: statusColor,
                          padding: 6
                        }
                      ]}
                      onPress={() => {
                        if (selectedCategory === item.status.toLowerCase()) {
                          setSelectedCategory(null);
                        } else {
                          setSelectedCategory(item.status.toLowerCase());
                        }
                      }}
                    >
                      <View style={styles.legendItemHeader}>
                        <View 
                          style={[
                            styles.legendColorDot, 
                            { backgroundColor: statusColor }
                          ]} 
                        />
                        <Text style={{ 
                          fontSize: 14, 
                          fontWeight: 'bold',
                          color: theme.COLORS.text.primary 
                        }}>
                          {item.status}
                        </Text>
                      </View>
                      
                      <View style={styles.legendItemValue}>
                        <Text style={{ 
                          fontSize: 18, 
                          fontWeight: 'bold',
                          color: statusColor 
                        }}>
                          {item.count}
                        </Text>
                        <Text style={{ 
                          fontSize: 12,
                          color: theme.COLORS.text.secondary,
                          marginLeft: 4
                        }}>
                          ({percentage}%)
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          
          {/* Tendência temporal - Somente se houver dados históricos */}
          <View style={[styles.trendSection, { borderTopColor: theme.COLORS.border.light, borderTopWidth: 1 }]}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: 'bold',
              color: theme.COLORS.text.secondary,
              marginBottom: 8 
            }}>
              Tendência (últimos 3 meses)
            </Text>
            
            <View style={styles.trendPlaceholder}>
              <Text style={{ color: theme.COLORS.text.secondary, fontSize: 12, fontStyle: 'italic' }}>
                Dados históricos serão exibidos aqui quando disponíveis
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Recent Apiaries */}
        {recentApiaries.length > 0 && (
          <View style={styles.apiariesContainer}>
            <AnimatedText 
              text="Apiários Recentes" 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginBottom: 12,
                color: theme.COLORS.text.primary 
              }}
              animationType="fade"
              delay={600}
            />
            {recentApiaries.slice(0, 2).map((apiary, index) => (
              <AnimatedCard key={apiary.id} animationType="slide" index={index} delay={700}>
                <View style={styles.apiaryHeader}>
                  <Text style={[styles.apiaryTitle, { color: theme.COLORS.text.primary }]}>
                    {apiary.name} ({apiary.id})
                  </Text>
                  <AnimatedButton
                    title="Detalhes"
                    variant="outline"
                    size="small"
                    onPress={() => {}}
                    style={{ marginLeft: 8 }}
                  />
                </View>
                
                <View style={styles.apiaryContent}>
                  <View style={styles.apiaryDetails}>
                    <View style={styles.apiaryDetailItem}>
                      <Ionicons name="location" size={16} color={theme.COLORS.primary.default} />
                      <Text style={[styles.apiaryDetailText, { color: theme.COLORS.text.secondary }]}>
                        {apiary.location}
                      </Text>
                    </View>
                    
                    <View style={styles.apiaryDetailItem}>
                      <Ionicons name="leaf" size={16} color={theme.COLORS.secondary.default} />
                      <Text style={[styles.apiaryDetailText, { color: theme.COLORS.text.secondary }]}>
                        {apiary.flora}
                      </Text>
                    </View>
                    
                    <View style={styles.apiaryDetailItem}>
                      <Ionicons 
                        name={apiary.weather.condition.toLowerCase().includes('sol') ? 'sunny' : 'cloudy'} 
                        size={16} 
                        color={theme.COLORS.accent.default} 
                      />
                      <Text style={[styles.apiaryDetailText, { color: theme.COLORS.text.secondary }]}>
                        {apiary.weather.temperature}, {apiary.weather.condition}
                      </Text>
                    </View>
                    
                    <View style={styles.apiaryDetailItem}>
                      <Ionicons name="calendar" size={16} color={theme.COLORS.text.secondary} />
                      <Text style={[styles.apiaryDetailText, { color: theme.COLORS.text.secondary }]}>
                        Última visita: {apiary.lastVisit}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.statusBadges}>
                    {Object.entries(apiary.stats).map(([key, value]) => {
                      if (value === 0) return null;
                      
                      let statusLabel, statusColor;
                      switch (key) {
                        case 'good': 
                          statusLabel = 'Boas';
                          statusColor = theme.COLORS.status.good;
                          break;
                        case 'strong': 
                          statusLabel = 'Fortes';
                          statusColor = theme.COLORS.status.strong;
                          break;
                        case 'weak': 
                          statusLabel = 'Fracas';
                          statusColor = theme.COLORS.status.weak;
                          break;
                        case 'dead': 
                          statusLabel = 'Mortas';
                          statusColor = theme.COLORS.status.dead;
                          break;
                        default:
                          statusLabel = key;
                          statusColor = theme.COLORS.text.secondary;
                      }
                      
                      return (
                        <View 
                          key={key} 
                          style={[
                            styles.statusBadge, 
                            { backgroundColor: `${statusColor}22`, borderColor: statusColor }
                          ]}
                        >
                          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                            {statusLabel}: {value}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        )}

        {/* Urgent Hives */}
        {urgentHives.length > 0 && (
          <View style={styles.urgentContainer}>
            <AnimatedText 
              text="Colmeias que Necessitam Atenção" 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginBottom: 12,
                color: theme.COLORS.text.primary 
              }}
              animationType="fade"
              delay={800}
            />
            {urgentHives.map((hive, index) => (
              <AnimatedCard key={hive.id} animationType="pop" index={index} delay={900}>
                <View style={styles.urgentCardContent}>
                  <View style={styles.urgentInfo}>
                    <Text style={[styles.urgentApiary, { color: theme.COLORS.text.primary }]}>{hive.apiary}</Text>
                    <View style={styles.statusRow}>
                      <View 
                        style={[
                          styles.statusIndicator, 
                          { backgroundColor: getStatusColor(hive.status, theme) }
                        ]} 
                      />
                      <Text style={[styles.urgentStatus, { color: theme.COLORS.text.secondary }]}>
                        {hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.urgentDetails}>
                      <Ionicons name="cube" size={14} color={theme.COLORS.text.secondary} />
                      <Text style={[styles.urgentQuantity, { color: theme.COLORS.text.secondary }]}>
                        Quantidade: {hive.quantity}
                      </Text>
                    </View>
                    <View style={styles.urgentDetails}>
                      <Ionicons name="alert-circle" size={14} color={theme.COLORS.status.weak} />
                      <Text style={[styles.urgentAction, { color: theme.COLORS.text.secondary }]}>
                        {hive.action}
                      </Text>
                    </View>
                  </View>
                  <AnimatedButton
                    title="Atender"
                    variant="primary"
                    size="small"
                    onPress={() => {}}
                  />
                </View>
              </AnimatedCard>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  apiariesContainer: {
    marginVertical: 16,
  },
  apiaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  apiaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  apiaryContent: {
    flexDirection: 'column',
  },
  apiaryDetails: {
    marginBottom: 12,
  },
  apiaryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  apiaryDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  statusBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  urgentContainer: {
    marginBottom: 16,
  },
  urgentCardContent: {
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
  urgentStatus: {
    fontSize: 14,
  },
  urgentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  urgentQuantity: {
    fontSize: 14,
    marginLeft: 6,
  },
  urgentAction: {
    fontSize: 14,
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  totalContainer: {
    marginRight: 24,
  },
  legendItems: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    width: '48%',
    marginBottom: 12,
  },
  legendItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendItemValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  legendColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  trendSection: {
    marginTop: 8,
    paddingTop: 16,
  },
  trendPlaceholder: {
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  chartControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartTypeButton: {
    borderRadius: 16,
    padding: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
});
