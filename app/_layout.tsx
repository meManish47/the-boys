import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; label: string; icon: IoniconsName; iconActive: IoniconsName }[] = [
  { name: "(tabs)/home",    label: "HOME",    icon: "home-outline",      iconActive: "home"           },
  { name: "(tabs)/match",   label: "MATCH",   icon: "basketball-outline", iconActive: "basketball"     },
  { name: "(tabs)/history", label: "HISTORY", icon: "time-outline",       iconActive: "time"           },
];

function TabIcon({
  focused,
  label,
  icon,
  iconActive,
}: {
  focused: boolean;
  label: string;
  icon: IoniconsName;
  iconActive: IoniconsName;
}) {
  const color = focused ? "#F59E0B" : "#444444";
  return (
    <View style={styles.tabItem}>
      <Ionicons name={focused ? iconActive : icon} size={22} color={color} />
      {focused && <View style={styles.activeLine} />}
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {TABS.map(({ name, label, icon, iconActive }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={label}
                icon={icon}
                iconActive={iconActive}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    height: 68,
    paddingBottom: 0,
    paddingTop: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 6,
    width: 80,
  },
  activeLine: {
    width: 4,
    height: 4,
    backgroundColor: "#F59E0B",
    // no borderRadius — flat square dot
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
    width: 80,
  },
}); 