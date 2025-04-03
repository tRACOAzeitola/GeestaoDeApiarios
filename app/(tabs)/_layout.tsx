import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../../constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.COLORS.primary.default,
        tabBarInactiveTintColor: Theme.COLORS.text.secondary,
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
