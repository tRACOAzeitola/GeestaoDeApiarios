import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types
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

interface Material {
  id: number;
  apiary: string;
  type: string;
  quantity: number;
}

interface ApiaryContextType {
  apiaries: Apiary[];
  urgentHives: Hive[];
  materials: Material[];
  addApiary: (apiary: Omit<Apiary, 'stats' | 'lastVisit' | 'weather'>) => void;
  addHives: (apiaryId: string, good: number, strong: number, weak: number, dead: number, observations: string) => void;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  attendHive: (hiveId: number) => void;
  updateLastVisit: (apiaryId: string, date: string) => void;
  updateWeather: (apiaryId: string, temperature: string, condition: string, humidity: string) => void;
  totalApiaries: () => number;
  totalHives: () => number;
  hivesData: () => {status: string, count: number}[];
  updateHiveStats: (apiaryId: string, status: 'good' | 'strong' | 'weak' | 'dead', count: number) => void;
}

// Create context
const ApiaryContext = createContext<ApiaryContextType | undefined>(undefined);

// Create provider
export const ApiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial data
  const [apiaries, setApiaries] = useState<Apiary[]>([
    {
      id: 'API-001',
      name: 'Apiário Rosmaninho',
      location: '40.6405° N, 7.9101° W',
      flora: 'Rosmaninho',
      lastVisit: '2023-10-15',
      weather: {
        temperature: '22°C',
        condition: 'Ensolarado',
        humidity: '55%'
      },
      stats: {
        good: 5,
        strong: 15,
        weak: 3,
        dead: 2
      }
    },
    {
      id: 'API-002',
      name: 'Apiário Castanheiro',
      location: '40.5503° N, 7.8234° W',
      flora: 'Flor de Castanheiro',
      lastVisit: '2023-10-20',
      weather: {
        temperature: '19°C',
        condition: 'Parcialmente nublado',
        humidity: '65%'
      },
      stats: {
        good: 8,
        strong: 10,
        weak: 2,
        dead: 0
      }
    },
    {
      id: 'API-003',
      name: 'Apiário Eucalipto',
      location: '40.7123° N, 7.8901° W',
      flora: 'Eucalipto',
      lastVisit: '2023-10-10',
      weather: {
        temperature: '24°C',
        condition: 'Ensolarado',
        humidity: '50%'
      },
      stats: {
        good: 12,
        strong: 5,
        weak: 1,
        dead: 1
      }
    }
  ]);

  const [urgentHives, setUrgentHives] = useState<Hive[]>([
    { id: 1, apiary: 'Rosmaninho (API-001)', status: 'forte', quantity: 15, action: 'Alça URGENTE' },
    { id: 2, apiary: 'Rosmaninho (API-001)', status: 'fraca', quantity: 3, action: 'Verificar rainha/alimentação' },
    { id: 3, apiary: 'Castanheiro (API-002)', status: 'fraca', quantity: 2, action: 'Verificar rainha/alimentação' },
    { id: 4, apiary: 'Rosmaninho (API-001)', status: 'morta', quantity: 2, action: 'Levar para Pavilhão' },
    { id: 5, apiary: 'Eucalipto (API-003)', status: 'morta', quantity: 1, action: 'Levar para Pavilhão' }
  ]);

  const [materials, setMaterials] = useState<Material[]>([]);

  // Add a new apiary
  const addApiary = (apiary: Omit<Apiary, 'stats' | 'lastVisit' | 'weather'>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newApiary: Apiary = {
      ...apiary,
      lastVisit: currentDate,
      weather: {
        temperature: '20°C',
        condition: 'Informação não disponível',
        humidity: '60%'
      },
      stats: {
        good: 0,
        strong: 0,
        weak: 0,
        dead: 0
      }
    };
    
    setApiaries([...apiaries, newApiary]);
  };

  // Update last visit date
  const updateLastVisit = (apiaryId: string, date: string) => {
    setApiaries(prev => prev.map(apiary => {
      if (apiary.id === apiaryId) {
        return {
          ...apiary,
          lastVisit: date
        };
      }
      return apiary;
    }));
  };

  // Update weather information
  const updateWeather = (apiaryId: string, temperature: string, condition: string, humidity: string) => {
    setApiaries(prev => prev.map(apiary => {
      if (apiary.id === apiaryId) {
        return {
          ...apiary,
          weather: {
            temperature,
            condition,
            humidity
          }
        };
      }
      return apiary;
    }));
  };

  // Get total number of apiaries
  const totalApiaries = () => {
    return apiaries.length;
  };

  // Get total number of hives
  const totalHives = () => {
    return apiaries.reduce((total, apiary) => {
      return total + apiary.stats.good + apiary.stats.strong + apiary.stats.weak + apiary.stats.dead;
    }, 0);
  };

  // Get hives data for charts
  const hivesData = () => {
    let goodTotal = 0;
    let strongTotal = 0;
    let weakTotal = 0;
    let deadTotal = 0;

    apiaries.forEach(apiary => {
      goodTotal += apiary.stats.good;
      strongTotal += apiary.stats.strong;
      weakTotal += apiary.stats.weak;
      deadTotal += apiary.stats.dead;
    });

    return [
      { status: 'Boas', count: goodTotal },
      { status: 'Fortes', count: strongTotal },
      { status: 'Fracas', count: weakTotal },
      { status: 'Mortas', count: deadTotal }
    ];
  };

  // Add hives to an apiary
  const addHives = (apiaryId: string, good: number, strong: number, weak: number, dead: number, observations: string) => {
    // Update apiary stats
    setApiaries(prev => prev.map(apiary => {
      if (apiary.id === apiaryId) {
        return {
          ...apiary,
          stats: {
            good: apiary.stats.good + good,
            strong: apiary.stats.strong + strong,
            weak: apiary.stats.weak + weak,
            dead: apiary.stats.dead + dead
          },
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return apiary;
    }));

    // Add urgent hives if needed
    const apiaryName = apiaries.find(a => a.id === apiaryId)?.name;
    const apiaryFullName = `${apiaryName} (${apiaryId})`;
    
    const newUrgentHives: Hive[] = [];
    
    if (strong > 0) {
      newUrgentHives.push({
        id: Date.now(),
        apiary: apiaryFullName,
        status: 'forte',
        quantity: strong,
        action: 'Alça URGENTE'
      });
    }
    
    if (weak > 0) {
      newUrgentHives.push({
        id: Date.now() + 1,
        apiary: apiaryFullName,
        status: 'fraca',
        quantity: weak,
        action: 'Verificar rainha/alimentação'
      });
    }
    
    if (dead > 0) {
      newUrgentHives.push({
        id: Date.now() + 2,
        apiary: apiaryFullName,
        status: 'morta',
        quantity: dead,
        action: 'Levar para Pavilhão'
      });
    }
    
    if (newUrgentHives.length > 0) {
      setUrgentHives([...urgentHives, ...newUrgentHives]);
    }
  };

  // Add a new material
  const addMaterial = (material: Omit<Material, 'id'>) => {
    const newMaterial = {
      ...material,
      id: Date.now()
    };
    
    setMaterials([...materials, newMaterial]);
  };

  // Attend to a hive
  const attendHive = (hiveId: number) => {
    setUrgentHives(prev => prev.filter(hive => hive.id !== hiveId));
  };

  // Update hive statistics for a specific apiary
  const updateHiveStats = (apiaryId: string, status: 'good' | 'strong' | 'weak' | 'dead', count: number) => {
    setApiaries(prev => prev.map(apiary => {
      if (apiary.id === apiaryId) {
        return {
          ...apiary,
          stats: {
            ...apiary.stats,
            [status]: count
          },
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return apiary;
    }));
  };

  return (
    <ApiaryContext.Provider value={{ 
      apiaries, 
      urgentHives, 
      materials, 
      addApiary, 
      addHives, 
      addMaterial, 
      attendHive,
      updateLastVisit,
      updateWeather,
      totalApiaries,
      totalHives,
      hivesData,
      updateHiveStats
    }}>
      {children}
    </ApiaryContext.Provider>
  );
};

// Create custom hook
export const useApiaryContext = () => {
  const context = useContext(ApiaryContext);
  if (context === undefined) {
    throw new Error('useApiaryContext must be used within an ApiaryProvider');
  }
  return context;
}; 