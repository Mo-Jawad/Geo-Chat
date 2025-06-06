
import React, { useState } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-blue-50/30 dark:bg-blue-950/20">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-4 flex items-center justify-between shadow-lg border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-400 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <p className="text-xs text-blue-100">
              {chat.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f8ff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#f8fafc'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-xs lg:max-w-md px-4 py-2 ${
                message.isOwn
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md'
              } rounded-2xl border-0`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`text-xs mt-1 ${
                message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp}
                {message.isOwn && message.status && (
                  <span className="ml-1">
                    {message.status === 'read' && '✓✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'sent' && '✓'}
                  </span>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-full border border-blue-200 bg-white dark:bg-gray-700 dark:border-blue-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 shadow-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
