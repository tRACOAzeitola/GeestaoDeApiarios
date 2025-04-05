import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Habilitar LayoutAnimation para Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChartItem {
  id: string;
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface InteractiveChartProps {
  data: ChartItem[];
  title?: string;
  type?: 'bar' | 'circle' | 'donut';
  onItemPress?: (item: ChartItem) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title,
  type = 'donut',
  onItemPress
}) => {
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<ChartItem | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Calculando o total para porcentagens
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Ajustar para layout responsivo
  const isSmallScreen = SCREEN_WIDTH < 360;
  const chartSize = isSmallScreen ? 180 : 220;
  const itemSize = isSmallScreen ? 46 : 56;
  
  const handleItemPress = (item: ChartItem) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (expandedItem === item.id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item.id);
    }
    
    setSelectedItem(item);
    
    if (onItemPress) {
      onItemPress(item);
    }
  };
  
  const renderCircleChart = () => {
    // Para o gráfico circular, dividimos em segmentos
    let cumulativeAngle = 0;
    
    return (
      <View style={[styles.circleContainer, { width: chartSize, height: chartSize }]}>
        <View style={styles.segments}>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const startAngle = cumulativeAngle;
            const endAngle = startAngle + percentage * 360;
            cumulativeAngle = endAngle;
            
            return (
              <View 
                key={item.id}
                style={[
                  styles.segment,
                  {
                    backgroundColor: item.color,
                    zIndex: selectedItem?.id === item.id ? 10 : index,
                    transform: [
                      { rotate: `${startAngle}deg` },
                      { scale: selectedItem?.id === item.id ? 1.05 : 1 }
                    ],
                    width: '100%',
                    height: '100%',
                    borderRadius: chartSize / 2,
                    clip: 'slice',
                    left: 0,
                    top: 0,
                    position: 'absolute',
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.segmentTouchable}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                />
              </View>
            );
          })}
          
          {/* Círculo central para fazer o formato de donut */}
          {type === 'donut' && (
            <View 
              style={[
                styles.donutHole, 
                { 
                  width: chartSize * 0.5, 
                  height: chartSize * 0.5,
                  borderRadius: chartSize * 0.25,
                  backgroundColor: theme.COLORS.surface.light
                }
              ]}
            >
              {selectedItem && (
                <View style={styles.selectedItemInfo}>
                  <Text style={[styles.selectedItemValue, { color: selectedItem.color }]}>
                    {selectedItem.value}
                  </Text>
                  <Text style={[styles.selectedItemLabel, { color: theme.COLORS.text.secondary }]}>
                    {selectedItem.label}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };
  
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <View style={styles.barContainer}>
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          const isExpanded = expandedItem === item.id;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.barItemContainer,
                {
                  height: isExpanded ? 80 : 60,
                  backgroundColor: isExpanded ? `${item.color}22` : theme.COLORS.surface.light,
                  borderLeftColor: item.color,
                  borderLeftWidth: 4
                }
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.barHeader}>
                <View style={styles.barLabelContainer}>
                  {item.icon && (
                    <Ionicons name={item.icon as any} size={18} color={item.color} style={styles.barIcon} />
                  )}
                  <Text style={[styles.barItemLabel, { color: theme.COLORS.text.primary }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.barItemValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </View>
              
              <View style={styles.barGraphContainer}>
                <Animated.View 
                  style={[
                    styles.barGraph, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }
                  ]} 
                />
              </View>
              
              {isExpanded && (
                <View style={styles.barExpandedInfo}>
                  <Text style={[styles.barExpandedText, { color: theme.COLORS.text.secondary }]}>
                    {Math.round((item.value / total) * 100)}% do total
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.surface.light }]}>
      {title && (
        <Text style={[styles.title, { color: theme.COLORS.text.primary }]}>
          {title}
        </Text>
      )}
      
      <View style={styles.chartWrapper}>
        {(type === 'circle' || type === 'donut') ? renderCircleChart() : renderBarChart()}
      </View>
      
      <View style={styles.legend}>
        {data.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={[
              styles.legendItem,
              selectedItem?.id === item.id && { backgroundColor: `${item.color}22` }
            ]}
            onPress={() => handleItemPress(item)}
          >
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendLabel, { color: theme.COLORS.text.secondary }]}>
              {item.label} ({item.value})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  circleContainer: {
    position: 'relative',
  },
  segments: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    position: 'absolute',
    overflow: 'hidden',
  },
  segmentTouchable: {
    width: '100%',
    height: '100%',
  },
  donutHole: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  selectedItemInfo: {
    alignItems: 'center',
  },
  selectedItemValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  selectedItemLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  legend: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
  },
  barContainer: {
    width: '100%',
    marginVertical: 8,
  },
  barItemContainer: {
    marginBottom: 12,
    borderRadius: 10,
    padding: 12,
    overflow: 'hidden',
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barIcon: {
    marginRight: 6,
  },
  barItemLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  barItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barGraphContainer: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barGraph: {
    height: '100%',
    borderRadius: 5,
  },
  barExpandedInfo: {
    marginTop: 8,
  },
  barExpandedText: {
    fontSize: 12,
  }
}); 