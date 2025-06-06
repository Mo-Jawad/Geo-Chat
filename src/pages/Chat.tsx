
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { ThemeToggle } from '@/components/theme-toggle';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import { MessageSquare } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data for demonstration
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      lastMessage: 'Thanks for the help yesterday!',
      timestamp: '1:15 PM',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Carol Davis',
      lastMessage: 'See you at the meeting tomorrow',
      timestamp: '12:45 PM',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '4',
      name: 'David Wilson',
      lastMessage: 'The project looks great so far',
      timestamp: 'Yesterday',
      isOnline: false,
    },
    {
      id: '5',
      name: 'Emma Brown',
      lastMessage: 'Can we reschedule our call?',
      timestamp: 'Yesterday',
      unreadCount: 3,
      isOnline: true,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      isOwn: false,
      status: 'read',
    },
    {
      id: '2',
      text: 'I am doing great, thanks! How about you?',
      timestamp: '2:32 PM',
      isOwn: true,
      status: 'read',
    },
    {
      id: '3',
      text: 'Pretty good! Working on some exciting projects',
      timestamp: '2:33 PM',
      isOwn: false,
      status: 'read',
    },
  ]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect to auth page if user is not authenticated
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/auth');
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent',
    };
    setMessages([...messages, newMessage]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gray-800 dark:bg-gray-900 text-white shadow-lg z-10 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <MessageSquare className="w-8 h-8" />
              Geo Chat
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user.email}
              </span>
              <ThemeToggle />
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-border">
          <ChatList
            chats={chats}
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChat?.id}
          />
        </div>
        
        {/* Chat Window */}
        <div className="flex-1">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-background">
              <div className="text-center">
                <MessageSquare className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Select a chat to start messaging
                </h2>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
