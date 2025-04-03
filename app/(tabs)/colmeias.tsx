import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApiaryContext } from '../../context/ApiaryContext';
import { useTheme } from '../../context/ThemeContext';

export default function HivesScreen() {
  const { apiaries, updateHiveStats } = useApiaryContext();
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApiaryId, setSelectedApiaryId] = useState<string | null>(null);
  
  // Extract all hives from all apiaries
  const allHives = apiaries.flatMap(apiary => {
    const hiveStats = apiary.stats;
    const hiveData = [];
    
    // Create hive entries based on stats
    if (hiveStats.good > 0) {
      hiveData.push({
        id: `${apiary.id}-good`,
        apiaryId: apiary.id,
        apiaryName: apiary.name,
        status: 'boa',
        count: hiveStats.good,
        marker: '🪨',
        description: '1 pedra ao meio'
      });
    }
    
    if (hiveStats.strong > 0) {
      hiveData.push({
        id: `${apiary.id}-strong`,
        apiaryId: apiary.id,
        apiaryName: apiary.name,
        status: 'forte',
        count: hiveStats.strong,
        marker: '🪨🪨',
        description: '2 pedras ao meio'
      });
    }
    
    if (hiveStats.weak > 0) {
      hiveData.push({
        id: `${apiary.id}-weak`,
        apiaryId: apiary.id,
        apiaryName: apiary.name,
        status: 'fraca',
        count: hiveStats.weak,
        marker: '↖️🪨',
        description: '1 pedra à esquerda'
      });
    }
    
    if (hiveStats.dead > 0) {
      hiveData.push({
        id: `${apiary.id}-dead`,
        apiaryId: apiary.id,
        apiaryName: apiary.name,
        status: 'morta',
        count: hiveStats.dead,
        marker: '🥢',
        description: '1 pau ao meio'
      });
    }
    
    return hiveData;
  });
  
  // Filter hives based on search query and selected apiary
  const filteredHives = allHives.filter(hive => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      hive.apiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by selected apiary
    const matchesApiary = selectedApiaryId === null || hive.apiaryId === selectedApiaryId;
    
    return matchesSearch && matchesApiary;
  });
  
  const handleUpdateHiveCount = (apiaryId: string, status: string, newCount: number) => {
    // Make sure newCount is not negative
    if (newCount < 0) newCount = 0;
    
    // Update the hive count in context
    updateHiveStats(apiaryId, status as 'good' | 'strong' | 'weak' | 'dead', newCount);
  };
  
  const apiariesList = apiaries.map(apiary => ({
    id: apiary.id,
    name: apiary.name
  }));
  
  const renderApiaryFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedApiaryId === null && { backgroundColor: theme.COLORS.primary.light }
        ]}
        onPress={() => setSelectedApiaryId(null)}
      >
        <Text style={[
          styles.filterChipText,
          selectedApiaryId === null && { color: theme.COLORS.primary.default }
        ]}>Todos</Text>
      </TouchableOpacity>
      
      {apiariesList.map(apiary => (
        <TouchableOpacity
          key={apiary.id}
          style={[
            styles.filterChip,
            selectedApiaryId === apiary.id && { backgroundColor: theme.COLORS.primary.light }
          ]}
          onPress={() => setSelectedApiaryId(apiary.id)}
        >
          <Text style={[
            styles.filterChipText,
            selectedApiaryId === apiary.id && { color: theme.COLORS.primary.default }
          ]}>{apiary.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderHiveItem = ({ item }) => (
    <View style={[styles.hiveCard, { backgroundColor: theme.COLORS.surface.light }]}>
      <View style={styles.hiveCardHeader}>
        <View style={styles.hiveInfo}>
          <Text style={[styles.apiaryName, { color: theme.COLORS.text.primary }]}>{item.apiaryName}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.markerText}>{item.marker}</Text>
            <Text style={[styles.statusText, { color: theme.COLORS.text.secondary }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)} - {item.description}
            </Text>
          </View>
        </View>
        <View style={styles.countContainer}>
          <TouchableOpacity
            style={[styles.countButton, { borderColor: theme.COLORS.border.default }]}
            onPress={() => handleUpdateHiveCount(item.apiaryId, item.status, item.count - 1)}
          >
            <Text style={[styles.countButtonText, { color: theme.COLORS.text.primary }]}>-</Text>
          </TouchableOpacity>
          
          <View style={[styles.countDisplay, { backgroundColor: getStatusColor(item.status, theme) }]}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.countButton, { borderColor: theme.COLORS.border.default }]}
            onPress={() => handleUpdateHiveCount(item.apiaryId, item.status, item.count + 1)}
          >
            <Text style={[styles.countButtonText, { color: theme.COLORS.text.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Helper function to get color based on status
  const getStatusColor = (status: string, theme: any) => {
    switch (status) {
      case 'boa': return theme.COLORS.status.good;
      case 'forte': return theme.COLORS.status.strong;
      case 'fraca': return theme.COLORS.status.weak;
      case 'morta': return theme.COLORS.status.dead;
      default: return theme.COLORS.primary.light;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.COLORS.primary.default }]}>
        <Text style={styles.headerTitle}>Gestão de Colmeias</Text>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: theme.COLORS.surface.light }]}>
          <Ionicons name="search" size={20} color={theme.COLORS.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.COLORS.text.primary }]}
            placeholder="Buscar por apiário ou status..."
            placeholderTextColor={theme.COLORS.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.COLORS.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          ListHeaderComponent={renderApiaryFilter}
          data={filteredHives}
          renderItem={renderHiveItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={theme.COLORS.text.disabled} />
              <Text style={[styles.emptyText, { color: theme.COLORS.text.secondary }]}>
                Nenhuma colmeia encontrada
              </Text>
            </View>
          }
        />
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  hiveCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  hiveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hiveInfo: {
    flex: 1,
  },
  apiaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countDisplay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  countText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 