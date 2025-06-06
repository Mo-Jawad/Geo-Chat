import React, { useState } from 'react';
import { Send, Smile, Phone, Video, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FileUpload from './FileUpload';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: {
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
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
  onSendMessage: (message: string, files?: File[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      onSendMessage(newMessage, selectedFiles);
      setNewMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.type.startsWith('image/');
    const isVideo = attachment.type.startsWith('video/');
    const isPdf = attachment.type === 'application/pdf';

    if (isImage) {
      return (
        <div className="mt-2">
          <img
            src={attachment.url || URL.createObjectURL(attachment)}
            alt={attachment.name}
            className="max-w-xs rounded-lg shadow-md cursor-pointer hover:opacity-90"
            onClick={() => window.open(attachment.url || URL.createObjectURL(attachment), '_blank')}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="mt-2">
          <video
            controls
            className="max-w-xs rounded-lg shadow-md"
            src={attachment.url || URL.createObjectURL(attachment)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="mt-2 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">PDF</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(attachment.url || URL.createObjectURL(attachment), '_blank')}
              className="text-blue-600 hover:text-blue-700"
            >
              Open
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col bg-violet-50/30 dark:bg-violet-950/20">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 dark:from-violet-700 dark:to-violet-800 text-white p-4 flex items-center justify-between shadow-lg border-b border-violet-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-violet-400 dark:bg-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
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
            <p className="text-xs text-violet-100">
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f3e8ff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#faf5ff'
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
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md'
              } rounded-2xl border-0`}
            >
              {message.text && <p className="text-sm">{message.text}</p>}
              
              {message.attachments && message.attachments.map((attachment, index) => (
                <div key={index}>
                  {renderAttachment(attachment)}
                </div>
              ))}
              
              <div className={`text-xs mt-1 ${
                message.isOwn ? 'text-violet-100' : 'text-gray-500 dark:text-gray-400'
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
      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-violet-200/50 dark:border-violet-800/50">
        <FileUpload 
          onFileSelect={handleFileSelect}
          className="mb-2"
        />
        
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-full border border-violet-200 bg-white dark:bg-gray-700 dark:border-violet-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-violet-600 hover:text-violet-700"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            className="bg-violet-500 hover:bg-violet-600 text-white rounded-full px-6 shadow-lg"
            disabled={!newMessage.trim() && selectedFiles.length === 0}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
