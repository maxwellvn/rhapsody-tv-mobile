import Loader from "@/components/loader";

type AppSpinnerProps = {
  size?: "small" | "large" | number;
  color?: string;
};

export function AppSpinner(_props: AppSpinnerProps) {
  return <Loader />;
}
