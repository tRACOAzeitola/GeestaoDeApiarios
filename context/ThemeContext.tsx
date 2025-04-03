import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DarkTheme from '../constants/DarkTheme';
import LightTheme from '../constants/Theme';

// Chave para armazenar preferência de tema
const THEME_PREFERENCE_KEY = '@theme_preference';

// Tipo para o contexto de tema
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof LightTheme;
};

// Criar o contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider do contexto
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Carregar preferência salva no AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        
        if (savedPreference !== null) {
          setIsDarkMode(savedPreference === 'dark');
        } else {
          // Se não houver preferência salva, usar o tema do dispositivo
          setIsDarkMode(deviceTheme === 'dark');
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar preferência de tema:', error);
        // Usar o tema do dispositivo em caso de erro
        setIsDarkMode(deviceTheme === 'dark');
        setIsLoaded(true);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Alternar entre temas e salvar preferência
  const toggleTheme = async () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    
    try {
      await AsyncStorage.setItem(
        THEME_PREFERENCE_KEY, 
        newThemeValue ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  };
  
  // Selecionar o tema correto
  const theme = isDarkMode ? DarkTheme : LightTheme;
  
  // Não renderizar até que o tema seja carregado
  if (!isLoaded) {
    return null;
  }
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}; 