import { FONTS } from '@/styles/global';
import { fs, hp, spacing } from '@/utils/responsive';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

type SettingsItemToggleProps = {
  label: string;
  description?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export function SettingsItemToggle({ 
  label, 
  description, 
  value: initialValue = false, 
  onValueChange 
}: SettingsItemToggleProps) {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onValueChange?.(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Switch
          trackColor={{ false: '#E5E5E5', true: '#93C5FD' }}
          thumbColor={isEnabled ? '#2563EB' : '#FFFFFF'}
          ios_backgroundColor="#E5E5E5"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(10),
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: '#171717',
    flex: 1,
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#737373',
    marginTop: hp(2),
    lineHeight: fs(18),
  },
});
