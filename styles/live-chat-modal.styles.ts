import { StyleSheet } from 'react-native';
import { FONTS } from './global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  viewerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewerCount: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    flex: 1,
  },
  messageUsername: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: '#000000',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#333333',
    lineHeight: 20,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  inputAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#000000',
    maxHeight: 100,
  },
  sendButton: {
    padding: 4,
    marginLeft: 8,
  },
});
