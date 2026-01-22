import { styles } from '@/styles/live-chat-modal.styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

type ChatMessage = {
  id: string;
  username: string;
  avatar: any;
  message: string;
};

type LiveChatModalProps = {
  onClose: () => void;
  viewerCount: string;
};

export function LiveChatModal({ onClose, viewerCount }: LiveChatModalProps) {
  const [message, setMessage] = useState('');

  // Sample chat messages
  const messages: ChatMessage[] = Array(10).fill(null).map((_, i) => ({
    id: `msg-${i}`,
    username: '@LuisSilva',
    avatar: require('@/assets/images/Avatar.png'),
    message: 'What a marvelous time in his presence. It is truly amazing',
  }));

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      console.log('Send message:', message);
      setMessage('');
    }
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
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            <Image
              source={msg.avatar}
              style={styles.messageAvatar}
              resizeMode="contain"
            />
            <View style={styles.messageContent}>
              <Text style={styles.messageUsername}>{msg.username}</Text>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <Image
          source={require('@/assets/images/Avatar.png')}
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
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#0000FF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
