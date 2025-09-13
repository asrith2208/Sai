// screens/ChatbotScreen.js - SAI Assistant Chatbot Screen
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,

  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS } from '../constants/theme';
import GeminiChatService from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const ChatbotScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      await GeminiChatService.initializeChat();
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now().toString(),
        text: `Hello ${user?.fullName || 'Athlete'}! I'm SAI Assistant, your personal guide for the SAI-Vision platform! 🏆\n\nI'm here to help you with:\n• Sports training and techniques\n• SAI-Vision app features\n• Selection criteria and processes\n• Academy programs\n• Performance improvement tips\n\nHow can I help you achieve your sports dreams today?`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Connection Error', 'Unable to connect to SAI Assistant. Please check your internet connection.');
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async (messageText = inputText.trim()) => {
    if (!messageText) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiChatService.sendMessage(messageText);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having technical difficulties. Please try again.",
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickResponse = (quickResponse) => {
    sendMessage(quickResponse.text);
  };

  const clearChat = async () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            setIsInitializing(true);
            await GeminiChatService.resetChat();
            await initializeChat();
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      {!item.isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="fitness" size={16} color={SAI_COLORS.white} />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.botMessageBubble,
        item.isError && styles.errorMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.botMessageText,
          item.isError && styles.errorMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestampText,
          item.isUser ? styles.userTimestampText : styles.botTimestampText
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderQuickResponses = () => (
    <View style={styles.quickResponsesContainer}>
      <Text style={styles.quickResponsesTitle}>Quick Questions:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.quickResponsesRow}>
          {GeminiChatService.getQuickResponses().map((quickResponse) => (
            <TouchableOpacity
              key={quickResponse.id}
              style={styles.quickResponseButton}
              onPress={() => handleQuickResponse(quickResponse)}
            >
              <Ionicons name={quickResponse.icon} size={16} color={SAI_COLORS.orange} />
              <Text style={styles.quickResponseText}>{quickResponse.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[SAI_COLORS.orange, SAI_COLORS.blue]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>SAI Assistant</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Sports Guide</Text>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <Ionicons name="fitness" size={48} color={SAI_COLORS.orange} />
          <Text style={styles.loadingText}>Initializing SAI Assistant...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[SAI_COLORS.orange, SAI_COLORS.blue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={SAI_COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>SAI Assistant</Text>
            <Text style={styles.headerSubtitle}>AI-Powered Sports Guide</Text>
          </View>
          
          <TouchableOpacity onPress={clearChat}>
            <Ionicons name="refresh" size={24} color={SAI_COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        {messages.length <= 1 && renderQuickResponses()}

        {isLoading && (
          <View style={styles.typingIndicator}>
            <View style={styles.botAvatar}>
              <Ionicons name="fitness" size={16} color={SAI_COLORS.white} />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>SAI Assistant is typing...</Text>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about sports, training, or SAI programs..."
            placeholderTextColor={SAI_COLORS.gray}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons 
              name={isLoading ? "hourglass" : "send"} 
              size={20} 
              color={(!inputText.trim() || isLoading) ? SAI_COLORS.gray : SAI_COLORS.white} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: SAI_COLORS.gray,
    marginTop: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SAI_COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: SAI_COLORS.orange,
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: SAI_COLORS.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
  },
  errorMessageBubble: {
    backgroundColor: SAI_COLORS.lightOrange,
    borderColor: SAI_COLORS.error,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: SAI_COLORS.white,
  },
  botMessageText: {
    color: SAI_COLORS.dark,
  },
  errorMessageText: {
    color: SAI_COLORS.error,
  },
  timestampText: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestampText: {
    color: SAI_COLORS.white,
    opacity: 0.8,
    textAlign: 'right',
  },
  botTimestampText: {
    color: SAI_COLORS.gray,
  },
  quickResponsesContainer: {
    padding: 16,
    paddingTop: 8,
  },
  quickResponsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 12,
  },
  quickResponsesRow: {
    flexDirection: 'row',
  },
  quickResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: SAI_COLORS.orange,
  },
  quickResponseText: {
    fontSize: 12,
    color: SAI_COLORS.dark,
    marginLeft: 6,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: SAI_COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: SAI_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: SAI_COLORS.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: SAI_COLORS.dark,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SAI_COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: SAI_COLORS.border,
  },
});

export default ChatbotScreen;