
import React, { useState } from 'react';

import { ChatProvider, useChat } from '@/contexts/ChatContext';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import MessageComposer from '@/components/chat/MessageComposer';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { users, currentUser } from '@/data/dummyData';
import CustomAvatar from '@/components/ui/CustomAvatar';

const NewChatDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { createNewConversation } = useChat();
  
  // Filter users excluding current user
  const filteredUsers = users
    .filter(user => user.id !== currentUser.id)
    .filter(user => 
      searchQuery.trim() === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const handleUserSelect = (userId: string) => {
    createNewConversation(userId);
    toast.success("New conversation started");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <CustomAvatar 
                    userId={user.id}
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChatContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  return (
    <>
      <div className="md:col-span-1 border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="ml-2 flex-shrink-0"
            onClick={() => setIsNewChatOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ConversationList searchQuery={searchQuery} />
        </div>
      </div>
      
      <div className="md:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
        <MessageComposer />
      </div>
      
      <NewChatDialog 
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
    </>
  );
};

const Chat = () => {
  return (
    <div>
      <div className="container px-4 max-w-6xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
};

export default Chat;
