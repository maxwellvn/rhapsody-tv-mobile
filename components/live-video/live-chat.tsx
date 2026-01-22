import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type LiveChatProps = {
  onPress?: () => void;
};

export function LiveChat({ onPress }: LiveChatProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>View Live Chat</Text>
      
      <View style={styles.chatRow}>
        <Image
          source={require('@/assets/images/Avatar.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Chat as Lennox Koko"
            placeholderTextColor="#AAAAAA"
            style={styles.input}
            editable={false}
            pointerEvents="none"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
  },
});
