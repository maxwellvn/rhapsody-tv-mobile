import { AppSpinner } from "@/components/app-spinner";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/context/AuthContext";
import {
  useAddComment,
  useDeleteComment,
  useReplyToComment,
  useToggleCommentLike,
  useVideoComments,
} from "@/hooks/queries/useVodQueries";
import { vodService } from "@/services/vod.service";
import { FONTS } from "@/styles/global";
import { formatRelativeTime } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CommentsModalProps = {
  videoId: string;
  onClose: () => void;
};

export function CommentsModal({ videoId, onClose }: CommentsModalProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<"Top" | "Newest">("Top");
  const [comment, setComment] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [replyTarget, setReplyTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [likedByMeMap, setLikedByMeMap] = useState<Record<string, boolean>>({});
  const [likeDeltaMap, setLikeDeltaMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOffset(e.endCoordinates?.height ?? 0);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sort = activeTab === "Top" ? "top" : "newest";
  const { data: commentsData, isLoading } = useVideoComments(videoId, 1, 20, sort);
  const addCommentMutation = useAddComment(videoId);
  const replyCommentMutation = useReplyToComment(videoId);
  const toggleCommentLikeMutation = useToggleCommentLike(videoId);
  const deleteCommentMutation = useDeleteComment(videoId);

  const comments = useMemo(
    () => commentsData?.comments ?? [],
    [commentsData?.comments],
  );
  const commentIds = useMemo(
    () =>
      comments.flatMap((item) => [
        item.id,
        ...(item.replies || []).map((reply) => reply.id),
      ]),
    [comments],
  );
  const commentIdsKey = useMemo(() => commentIds.join("|"), [commentIds]);
  const isSubmitting =
    addCommentMutation.isPending ||
    replyCommentMutation.isPending ||
    toggleCommentLikeMutation.isPending ||
    deleteCommentMutation.isPending;

  const handleSend = async () => {
    if (comment.trim()) {
      try {
        if (replyTarget) {
          await replyCommentMutation.mutateAsync({
            commentId: replyTarget.id,
            data: { message: comment.trim() },
          });
        } else {
          await addCommentMutation.mutateAsync({ message: comment.trim() });
        }
        setComment("");
        setReplyTarget(null);
      } catch (error: any) {
        showAlert(
          replyTarget ? "Reply not sent" : "Comment not sent",
          error?.message || "Please try again.",
        );
      }
    }
  };

  useEffect(() => {
    let isActive = true;

    const ids = commentIds;

    if (ids.length === 0) {
      setLikedByMeMap({});
      setLikeDeltaMap({});
      return;
    }

    (async () => {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await vodService.getCommentLikeStatus(id);
            const payload = res?.data as
              | { isLiked?: boolean; liked?: boolean }
              | undefined;
            const isLiked =
              typeof payload?.isLiked === "boolean"
                ? payload.isLiked
                : typeof payload?.liked === "boolean"
                  ? payload.liked
                  : false;
            return [id, isLiked] as const;
          } catch {
            return [id, false] as const;
          }
        }),
      );

      if (!isActive) return;
      const fetched: Record<string, boolean> = {};
      results.forEach(([id, isLiked]) => {
        fetched[id] = isLiked;
      });

      setLikedByMeMap((prev) => {
        const filteredPrev: Record<string, boolean> = {};
        ids.forEach((id) => {
          if (id in prev) filteredPrev[id] = prev[id];
        });
        return { ...filteredPrev, ...fetched };
      });

      setLikeDeltaMap((prev) => {
        const filteredPrev: Record<string, number> = {};
        ids.forEach((id) => {
          if (id in prev) filteredPrev[id] = prev[id];
        });
        return filteredPrev;
      });
    })();

    return () => {
      isActive = false;
    };
  }, [commentIds, commentIdsKey]);

  const toggleLike = async (commentId: string, currentLiked: boolean) => {
    setLikedByMeMap((prev) => ({ ...prev, [commentId]: !currentLiked }));
    setLikeDeltaMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] ?? 0) + (currentLiked ? -1 : 1),
    }));

    try {
      const result = await toggleCommentLikeMutation.mutateAsync(commentId);
      const nextLiked =
        typeof result?.liked === "boolean" ? result.liked : !currentLiked;
      setLikedByMeMap((prev) => ({ ...prev, [commentId]: nextLiked }));
    } catch (error: any) {
      setLikedByMeMap((prev) => ({ ...prev, [commentId]: currentLiked }));
      setLikeDeltaMap((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] ?? 0) + (currentLiked ? 1 : -1),
      }));
      showAlert("Like failed", error?.message || "Please try again.");
    }
  };

  const openCommentMenu = (
    commentId: string,
    authorName: string,
    isLiked: boolean,
    isOwnComment: boolean,
  ) => {
    if (isOwnComment) {
      showAlert("Your comment", "Choose an action", [
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCommentMutation.mutateAsync(commentId);
            } catch (error: any) {
              showAlert(
                "Delete failed",
                error?.message || "Please try again.",
              );
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
      return;
    }

    showAlert("Comment", `By ${authorName}`, [
      {
        text: "Reply",
        onPress: () => setReplyTarget({ id: commentId, name: authorName }),
      },
      {
        text: isLiked ? "Unlike" : "Like",
        onPress: () => toggleLike(commentId, isLiked),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000000" />
        </Pressable>
      </View>

      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "Top" && styles.activeTab]}
          onPress={() => setActiveTab("Top")}
        >
          <Text style={[styles.tabText, activeTab === "Top" && styles.activeTabText]}>
            Top
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "Newest" && styles.activeTab]}
          onPress={() => setActiveTab("Newest")}
        >
          <Text style={[styles.tabText, activeTab === "Newest" && styles.activeTabText]}>
            Newest
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <AppSpinner size="large" color="#0000FF" />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.commentsContainer}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {comments.map((commentItem) => {
            const author = commentItem.author ?? (commentItem as any).user;
            const authorId = author?.id || commentItem.userId;
            const isCurrentUser = !!user?.id && authorId === user.id;
            const authorName = author?.name ?? author?.fullName ?? "Unknown User";
            const authorAvatar = isCurrentUser ? user?.avatar : author?.avatar;
            const authorGender = isCurrentUser ? user?.gender : author?.gender;
            const commentText = commentItem.content ?? commentItem.message ?? "";
            const baseLikeCount = commentItem.likes ?? commentItem.likeCount ?? 0;
            const likeDelta = likeDeltaMap[commentItem.id] ?? 0;
            const likeCount = Math.max(0, baseLikeCount + likeDelta);
            const repliesCount = commentItem.replyCount ?? commentItem.replies?.length ?? 0;
            const isLiked =
              likedByMeMap[commentItem.id] ?? Boolean(commentItem.isLiked);
            const firstReplyAuthor =
              commentItem.replies?.[0]?.author ??
              (commentItem.replies?.[0] as any)?.user;
            const isCurrentUserReply =
              !!user?.id && firstReplyAuthor?.id && firstReplyAuthor.id === user.id;

            return (
              <View key={commentItem.id}>
                <View style={styles.commentItem}>
                  <UserAvatar
                    avatarKey={authorAvatar}
                    gender={authorGender}
                    seed={authorId || authorName || commentItem.id}
                    size={40}
                    style={styles.commentAvatar}
                  />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUsername} numberOfLines={1}>
                      {authorName}
                    </Text>
                      <Text style={styles.commentTime}>
                        · {formatRelativeTime(commentItem.createdAt)}
                      </Text>
                      <Pressable
                        style={styles.menuButton}
                        onPress={() =>
                          openCommentMenu(
                            commentItem.id,
                            authorName,
                            isLiked,
                            isCurrentUser,
                          )
                        }
                      >
                        <Ionicons
                          name="ellipsis-vertical"
                          size={16}
                          color="#666666"
                        />
                      </Pressable>
                    </View>
                    <Text style={styles.commentText}>{commentText}</Text>

                    <View style={styles.commentActions}>
                      {!isCurrentUser && (
                        <>
                          <Pressable
                            style={styles.actionButton}
                            onPress={() => toggleLike(commentItem.id, isLiked)}
                          >
                            <Ionicons
                              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                              size={16}
                              color={isLiked ? "#0000FF" : "#666666"}
                            />
                            <Text style={styles.actionText}>{likeCount}</Text>
                          </Pressable>
                          <Pressable
                            style={styles.actionButton}
                            onPress={() =>
                              setReplyTarget({
                                id: commentItem.id,
                                name: authorName,
                              })
                            }
                          >
                            <Ionicons
                              name="chatbubble-outline"
                              size={16}
                              color="#666666"
                            />
                            <Text style={styles.actionText}>{repliesCount}</Text>
                          </Pressable>
                        </>
                      )}
                      {isCurrentUser && (
                        <Pressable
                          style={styles.actionButton}
                          onPress={() =>
                            openCommentMenu(commentItem.id, authorName, isLiked, true)
                          }
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          <Text style={[styles.actionText, { color: "#DC2626" }]}>
                            Delete
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                {repliesCount > 0 && (
                  <View style={styles.repliesContainer}>
                    <Pressable
                      style={styles.repliesIndicator}
                      onPress={() =>
                        setReplyTarget({ id: commentItem.id, name: authorName })
                      }
                    >
                      <UserAvatar
                        avatarKey={
                          isCurrentUserReply ? user?.avatar : firstReplyAuthor?.avatar
                        }
                        gender={
                          isCurrentUserReply ? user?.gender : firstReplyAuthor?.gender
                        }
                        seed={
                          (isCurrentUserReply ? user?.id : firstReplyAuthor?.id) ||
                          firstReplyAuthor?.name ||
                          firstReplyAuthor?.fullName ||
                          commentItem.id
                        }
                        size={24}
                        style={styles.replyAvatar}
                      />
                      <Text style={styles.repliesText}>
                        · {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
                      </Text>
                    </Pressable>

                    {(commentItem.replies || []).map((reply) => {
                      const replyAuthor = reply.author ?? (reply as any).user;
                      const replyAuthorId = replyAuthor?.id || reply.userId;
                      const replyIsCurrentUser =
                        !!user?.id && replyAuthorId === user.id;
                      const replyName =
                        replyAuthor?.name ??
                        replyAuthor?.fullName ??
                        "Unknown User";
                      const replyText = reply.content ?? reply.message ?? "";

                      return (
                        <View key={reply.id} style={styles.replyItem}>
                          <UserAvatar
                            avatarKey={
                              replyIsCurrentUser ? user?.avatar : replyAuthor?.avatar
                            }
                            gender={
                              replyIsCurrentUser ? user?.gender : replyAuthor?.gender
                            }
                            seed={replyAuthorId || replyName || reply.id}
                            size={24}
                            style={styles.replyAvatar}
                          />
                          <View style={styles.replyContent}>
                            <Text style={styles.replyName} numberOfLines={1}>
                              {replyName}
                            </Text>
                            <Text style={styles.replyText}>{replyText}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <View
        style={[
          styles.inputArea,
          {
            marginBottom: keyboardOffset,
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <UserAvatar
          avatarKey={user?.avatar}
          gender={user?.gender}
          seed={user?.id || user?.fullName || user?.username || "current-user"}
          size={40}
          style={styles.inputAvatar}
        />
        <View style={styles.inputContainer}>
          {replyTarget && (
            <View style={styles.replyingRow}>
              <Text style={styles.replyingText} numberOfLines={1}>
                Replying to {replyTarget.name}
              </Text>
              <Pressable onPress={() => setReplyTarget(null)}>
                <Ionicons name="close" size={16} color="#666666" />
              </Pressable>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={replyTarget ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <Pressable
              onPress={handleSend}
              style={styles.sendButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <AppSpinner size="small" color="#0000FF" />
              ) : (
                <Ionicons name="send" size={20} color="#0000FF" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: "#000000",
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: "#0000FF",
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#666666",
  },
  commentsContainer: {
    flex: 1,
  },
  commentsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    minWidth: 0,
  },
  commentUsername: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: "#000000",
    flexShrink: 1,
    maxWidth: "55%",
  },
  commentTime: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#666666",
    marginLeft: 4,
    flexShrink: 0,
  },
  menuButton: {
    marginLeft: "auto",
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#666666",
  },
  repliesIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 52,
    marginTop: -8,
    marginBottom: 8,
  },
  repliesContainer: {
    marginBottom: 16,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  repliesText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#0000FF",
    marginLeft: 8,
  },
  replyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 52,
    marginBottom: 8,
    gap: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: "#111827",
  },
  replyText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: "#374151",
    lineHeight: 18,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  inputAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    minWidth: 0,
  },
  replyingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    minWidth: 0,
  },
  replyingText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: "#4B5563",
    flex: 1,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#000000",
    maxHeight: 120,
  },
  sendButton: {
    padding: 4,
    marginLeft: 8,
    alignSelf: "flex-end",
  },
});
