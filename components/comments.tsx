import { FONTS } from '@/styles/global';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type CommentsProps = {
  commentCount: number;
  onPress?: () => void;
};

export function Comments({ commentCount, onPress }: CommentsProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <Text style={styles.count}>{commentCount}</Text>
      </View>

      <View style={styles.commentItem}>
        <Image
          source={require('@/assets/images/Avatar.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.commentContent}>
          <Text style={styles.commentText}>Glory!!!!!!</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  count: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#000000',
    lineHeight: 20,
  },
});
