import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/context/AuthContext";
import { SocketComment } from "@/hooks/useLivestreamSocket";
import { styles } from "@/styles/live-chat-modal.styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LiveChatModalProps = {
  onClose: () => void;
  viewerCount: string;
  comments: SocketComment[];
  onSendMessage: (content: string) => void;
};

export function LiveChatModal({
  onClose,
  viewerCount,
  comments,
  onSendMessage,
}: LiveChatModalProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOffset(e.endCoordinates?.height ?? 0);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 60);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Live Chat</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000000" />
          </Pressable>
        </View>
        <View style={styles.viewerCountContainer}>
          <Ionicons name="eye-outline" size={16} color="#737373" />
          <Text style={styles.viewerCount}>{viewerCount}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[styles.messagesContent, { paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {comments.map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            {(() => {
              const isCurrentUser = !!user?.id && msg.user.id === user.id;
              return (
            <UserAvatar
              avatarKey={isCurrentUser ? user?.avatar : msg.user.avatar}
              gender={isCurrentUser ? user?.gender : msg.user.gender}
              seed={
                isCurrentUser
                  ? user?.id || user?.fullName || user?.username || "current-user"
                  : msg.user.id || msg.user.fullName || "live-chat-user"
              }
              size={40}
              style={styles.messageAvatar}
            />
              );
            })()}
            <View style={styles.messageContent}>
              <Text style={styles.messageUsername}>
                {msg.user.fullName || `@${msg.user.id}`}
              </Text>
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

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
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            onFocus={scrollToBottom}
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#0000FF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
