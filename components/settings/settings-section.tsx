import { StyleSheet, View } from 'react-native';

type SettingsSectionProps = {
  children: React.ReactNode;
};

export function SettingsSection({ children }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
});
