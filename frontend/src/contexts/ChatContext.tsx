import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, currentUser, users } from '@/data/dummyData';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  selectConversation: (conversationId: string) => void;
  sendMessage: (text: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  createNewConversation: (userId: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Generate some dummy messages
const generateDummyMessages = (): Message[] => {
  const dummyMessages: Message[] = [];
  
  // For each user, create a conversation with the current user
  users.slice(0, 5).forEach((user, userIndex) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    
    // Add between 3-10 messages for each conversation
    const messageCount = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 0; i < messageCount; i++) {
      const isFromCurrentUser = Math.random() > 0.5;
      const hours = Math.floor(Math.random() * 48);
      const timestamp = new Date(startDate);
      timestamp.setHours(timestamp.getHours() + hours);
      
      dummyMessages.push({
        id: `msg_${userIndex}_${i}`,
        senderId: isFromCurrentUser ? currentUser.id : user.id,
        receiverId: isFromCurrentUser ? user.id : currentUser.id,
        text: getRandomMessage(isFromCurrentUser, i),
        timestamp,
        read: isFromCurrentUser || hours > 24
      });
    }
  });
  
  // Sort messages by timestamp
  return dummyMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Helper to get random message text
const getRandomMessage = (isFromCurrentUser: boolean, index: number): string => {
  const currentUserMessages = [
    "Hey, how's it going?",
    "Did you see that new design?",
    "I'm working on a new project, would love your input!",
    "Can we chat about the collaboration idea?",
    "Just wanted to check in about the meeting tomorrow.",
    "I sent you the files you requested.",
    "Let me know what you think about the proposal.",
    "Are you available for a quick call later?",
    "Thanks for your help earlier!",
    "Have you had a chance to look at my message?"
  ];
  
  const otherUserMessages = [
    "Doing great, how about you?",
    "Yes, it looks amazing!",
    "I'd be happy to provide some feedback.",
    "I'm interested in the collaboration, tell me more.",
    "I'll be there, thanks for the reminder.",
    "Got them, thanks!",
    "The proposal looks good to me.",
    "Sure, I'm free around 3pm.",
    "No problem at all!",
    "I'll check it out right now."
  ];
  
  // Use index if within range, otherwise pick random
  const messageArray = isFromCurrentUser ? currentUserMessages : otherUserMessages;
  const messageIndex = index < messageArray.length ? index : Math.floor(Math.random() * messageArray.length);
  
  return messageArray[messageIndex];
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allMessages, setAllMessages] = useState<Message[]>(generateDummyMessages());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  
  // Initialize conversations from messages
  useEffect(() => {
    const conversationsMap = new Map<string, Conversation>();
    
    allMessages.forEach(message => {
      const otherUserId = message.senderId === currentUser.id 
        ? message.receiverId 
        : message.senderId;
      
      // Create conversation key (always sort IDs to ensure consistency)
      const participantIds = [currentUser.id, otherUserId].sort();
      const conversationId = `conv_${participantIds.join('_')}`;
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          participants: participantIds,
          lastMessage: null,
          unreadCount: 0
        });
      }
      
      const conversation = conversationsMap.get(conversationId)!;
      
      // Update lastMessage if this message is newer
      if (!conversation.lastMessage || 
          message.timestamp > conversation.lastMessage.timestamp) {
        conversation.lastMessage = message;
      }
      
      // Count unread messages
      if (message.senderId !== currentUser.id && !message.read) {
        conversation.unreadCount += 1;
      }
    });
    
    // Convert map to array and sort by lastMessage timestamp (newest first)
    const sortedConversations = Array.from(conversationsMap.values())
      .sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
      });
    
    setConversations(sortedConversations);
    
    // If there are conversations, select the first one by default
    if (sortedConversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(sortedConversations[0].id);
    }
  }, [allMessages, currentConversationId]);
  
  // Update current messages when conversation changes
  useEffect(() => {
    if (!currentConversationId) {
      setCurrentMessages([]);
      return;
    }
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) {
      setCurrentMessages([]);
      return;
    }
    
    // Get all messages for this conversation
    const conversationMessages = allMessages.filter(message => 
      conversation.participants.includes(message.senderId) && 
      conversation.participants.includes(message.receiverId)
    );
    
    setCurrentMessages(conversationMessages);
    
    // Mark messages as read
    markConversationAsRead(currentConversationId);
  }, [currentConversationId, conversations, allMessages]);
  
  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };
  
  const sendMessage = (text: string) => {
    if (!currentConversationId || !text.trim()) return;
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;
    
    // Find the other participant
    const otherUserId = conversation.participants.find(id => id !== currentUser.id);
    if (!otherUserId) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUserId,
      text: text.trim(),
      timestamp: new Date(),
      read: false
    };
    
    // Update state
    setAllMessages(prev => [...prev, newMessage]);
  };
  
  const markConversationAsRead = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Mark all messages in this conversation as read
    setAllMessages(prev => 
      prev.map(message => {
        if (
          conversation.participants.includes(message.senderId) && 
          conversation.participants.includes(message.receiverId) &&
          message.senderId !== currentUser.id &&
          !message.read
        ) {
          return { ...message, read: true };
        }
        return message;
      })
    );
  };
  
  const createNewConversation = (userId: string): string => {
    // Create conversation key (always sort IDs to ensure consistency)
    const participantIds = [currentUser.id, userId].sort();
    const conversationId = `conv_${participantIds.join('_')}`;
    
    // Check if the conversation already exists
    const existingConversation = conversations.find(c => c.id === conversationId);
    if (existingConversation) {
      // If it exists, select it and return the ID
      selectConversation(conversationId);
      return conversationId;
    }
    
    // Create new conversation
    const newConversation: Conversation = {
      id: conversationId,
      participants: participantIds,
      lastMessage: null,
      unreadCount: 0
    };
    
    // Add to conversations list
    setConversations(prev => [newConversation, ...prev]);
    
    // Select the new conversation
    selectConversation(conversationId);
    
    return conversationId;
  };
  
  return (
    <ChatContext.Provider 
      value={{
        conversations,
        currentConversation: conversations.find(c => c.id === currentConversationId) || null,
        messages: currentMessages,
        selectConversation,
        sendMessage,
        markConversationAsRead,
        createNewConversation
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
