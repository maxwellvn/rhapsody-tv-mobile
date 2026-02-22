import { UserAvatar } from '@/components/user-avatar';
import { useAuth } from '@/context/AuthContext';
import { FONTS } from '@/styles/global';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type CommentsProps = {
  commentCount: number;
  onPress?: () => void;
  previewComment?: {
    authorId?: string;
    content: string;
    authorAvatar?: string;
    authorGender?: "male" | "female";
  };
};

export function Comments({ commentCount, onPress, previewComment }: CommentsProps) {
  const { user } = useAuth();
  const isCurrentUserPreview =
    !!user?.id && !!previewComment?.authorId && previewComment.authorId === user.id;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <Text style={styles.count}>{commentCount}</Text>
      </View>

      {previewComment ? (
        <View style={styles.commentItem}>
          <UserAvatar
            avatarKey={isCurrentUserPreview ? user?.avatar : previewComment.authorAvatar}
            gender={isCurrentUserPreview ? user?.gender : previewComment.authorGender}
            seed={previewComment.content}
            size={40}
            style={styles.avatar}
          />
          <View style={styles.commentContent}>
            <Text style={styles.commentText} numberOfLines={2}>
              {previewComment.content}
            </Text>
          </View>
        </View>
      ) : commentCount === 0 ? (
        <Text style={styles.emptyText}>Be the first to comment</Text>
      ) : null}
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
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#737373',
  },
});
