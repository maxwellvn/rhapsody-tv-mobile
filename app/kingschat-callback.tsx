import { AppSpinner } from "@/components/app-spinner";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KingsChatCallbackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppSpinner size="small" color="#1C4ED8" />
      <Text style={styles.text}>Completing KingsChat sign in...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    gap: 12,
    paddingHorizontal: 24,
  },
  text: {
    color: "#374151",
    fontSize: 14,
  },
});
