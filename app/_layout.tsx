import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: "Attendance", tabBarIcon: () => null }} />
      <Tabs.Screen name="match" options={{ title: "Match", tabBarIcon: () => null }} />
    </Tabs>
  );
}