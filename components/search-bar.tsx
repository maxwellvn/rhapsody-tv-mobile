import { FONTS } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type ViewStyle } from 'react-native';

type SearchBarProps = {
  placeholder?: string;
  initialValue?: string;
  value?: string;
  onSearch?: (text: string) => void;
  onSubmit?: (text: string) => void;
  style?: ViewStyle;
};

export function SearchBar({
  placeholder = 'Search channels and programs...',
  initialValue = '',
  value,
  onSearch,
  onSubmit,
  style
}: SearchBarProps) {
  const [searchText, setSearchText] = useState(value ?? initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setSearchText(value);
    }
  }, [value]);

  useEffect(() => {
    if (value === undefined) {
      setSearchText(initialValue);
    }
  }, [initialValue, value]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const handleClear = () => {
    setSearchText('');
    onSearch?.('');
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={handleSearch}
        returnKeyType="search"
        onSubmitEditing={() => onSubmit?.(searchText)}
      />
      {searchText.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
