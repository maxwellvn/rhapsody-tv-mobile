import { SocketComment } from "@/hooks/useLivestreamSocket";
import { styles } from "@/styles/live-chat-modal.styles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(keyboardShowEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration : 250,
        useNativeDriver: false,
      }).start();
      // Scroll to bottom when keyboard shows
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    });

    const hideSubscription = Keyboard.addListener(keyboardHideEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

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
      {/* Header */}
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

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {comments.map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            <Image
              source={require("@/assets/images/Avatar.png")}
              style={styles.messageAvatar}
              resizeMode="contain"
            />
            <View style={styles.messageContent}>
              <Text style={styles.messageUsername}>
                {msg.user.fullName || `@${msg.user.id}`}
              </Text>
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <Animated.View
        style={[styles.inputArea, { marginBottom: keyboardHeight }]}
      >
        <Image
          source={require("@/assets/images/Avatar.png")}
          style={styles.inputAvatar}
          resizeMode="contain"
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
      </Animated.View>
    </View>
  );
}
