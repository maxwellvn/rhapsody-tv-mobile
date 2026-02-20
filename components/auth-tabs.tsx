import { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AuthTab = "register" | "signin";

type AuthTabsProps = {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
  disabled?: boolean;
};

export function AuthTabs({ activeTab, onTabChange, disabled = false }: AuthTabsProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(activeTab === "register" ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(indicatorX, {
      toValue: activeTab === "register" ? 0 : 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [activeTab, indicatorX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const indicatorWidth = Math.max((containerWidth - 8) / 2, 0);
  const translateX = indicatorX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, indicatorWidth + 4],
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeIndicator,
            {
              width: indicatorWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      <Pressable
        onPress={() => onTabChange("register")}
        style={styles.tab}
        disabled={disabled || activeTab === "register"}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "register" && styles.activeTabText,
          ]}
        >
          Register
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onTabChange("signin")}
        style={styles.tab}
        disabled={disabled || activeTab === "signin"}
      >
        <Text
          style={[styles.tabText, activeTab === "signin" && styles.activeTabText]}
        >
          Sign In
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  activeIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF0",
    shadowColor: "#1E293B",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  activeTabText: {
    color: "#0F172A",
  },
});
