
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { currentUser, findUserById } from '@/data/dummyData';
import { formatRelativeTime } from '@/data/dummyData';
import CustomAvatar from '@/components/ui/CustomAvatar';
import { cn } from '@/lib/utils';

const MessageList: React.FC = () => {
  const { messages, currentConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentConversation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: typeof messages } = {};
  messages.forEach(message => {
    const date = message.timestamp.toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const dateGroups = Object.entries(groupedMessages);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {dateGroups.map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <span className="text-xs bg-accent/50 text-muted-foreground px-2 py-1 rounded-full">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          {dateMessages.map(message => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = findUserById(message.senderId);
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex items-end gap-2 max-w-[80%]",
                  isCurrentUser ? "self-end ml-auto" : "self-start mr-auto"
                )}
              >
                {!isCurrentUser && (
                  <CustomAvatar 
                    userId={sender.id}
                    src={sender.avatar}
                    alt={sender.name}
                    size="sm"
                    className="mb-1"
                  />
                )}
                
                <div className="space-y-1">
                  <div 
                    className={cn(
                      "rounded-2xl px-4 py-2 break-words",
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-accent rounded-bl-none"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <p className={cn(
                    "text-xs text-muted-foreground",
                    isCurrentUser ? "text-right" : "text-left"
                  )}>
                    {formatRelativeTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
