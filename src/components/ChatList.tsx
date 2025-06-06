
import React from 'react';
import { User, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect, selectedChatId }) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-gray-700 dark:bg-gray-800 text-white border-b border-gray-600">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Chats
        </h1>
      </div>
      
      <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
        {chats.map((chat) => (
          <Card
            key={chat.id}
            className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
              selectedChatId === chat.id
                ? 'bg-blue-50 dark:bg-blue-900/30 border-l-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-800 border-l-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-foreground truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.timestamp}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
