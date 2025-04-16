
import React, { useState, KeyboardEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, PaperclipIcon, Smile } from 'lucide-react';

const MessageComposer: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentConversation } = useChat();
  
  const handleSend = () => {
    if (message.trim() && currentConversation) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!currentConversation) {
    return null;
  }
  
  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] max-h-[120px] resize-none"
        />
        <div className="flex flex-col justify-end">
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Smile className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
