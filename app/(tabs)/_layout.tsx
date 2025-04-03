import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.COLORS.primary.default,
        tabBarInactiveTintColor: theme.COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: isDarkMode ? theme.COLORS.surface.dark : 'white',
          borderTopColor: theme.COLORS.border.light,
        },
        headerStyle: {
          backgroundColor: theme.COLORS.primary.default,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <ThemeToggle size="small" />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="apiarios"
        options={{
          title: "Apiários",
          tabBarIcon: ({ color }) => <Ionicons name="leaf" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="colmeias"
        options={{
          title: "Colmeias",
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="materiais"
        options={{
          title: "Materiais",
          tabBarIcon: ({ color }) => <Ionicons name="cube" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="clima"
        options={{
          title: "Clima",
          tabBarIcon: ({ color }) => <Ionicons name="sunny" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
