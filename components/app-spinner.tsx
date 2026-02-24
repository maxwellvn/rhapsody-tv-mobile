import { ActivityIndicator } from "react-native";

type AppSpinnerProps = {
  size?: "small" | "large" | number;
  color?: string;
};

export function AppSpinner({ size = "small", color }: AppSpinnerProps) {
  return <ActivityIndicator size={typeof size === "number" ? size : size} color={color} />;
}
