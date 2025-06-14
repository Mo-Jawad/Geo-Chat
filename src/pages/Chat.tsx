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
  attachments?: {
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSendMessage = (messageText: string, files?: File[]) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent',
    };

    // Add file attachments if any
    if (files && files.length > 0) {
      newMessage.attachments = files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // In a real app, upload to storage first
      }));
    }

    setMessages([...messages, newMessage]);

    // Show success toast for file uploads
    if (files && files.length > 0) {
      toast({
        title: 'Files Shared',
        description: `${files.length} file(s) shared successfully`,
      });
    }
  };

  // Get username from user metadata or fallback to email prefix
  const getDisplayName = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/50 dark:to-purple-950/50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 via-violet-700 to-purple-700 dark:from-violet-800 dark:via-violet-900 dark:to-purple-900 text-white shadow-xl z-10 border-b border-violet-500/30">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-violet-200" />
              <span className="bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
                Geo Chat
              </span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-lg text-violet-100">
                Welcome, {getDisplayName()}
              </span>
              <ThemeToggle />
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                className="border-violet-300/50 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
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
        <div className="w-1/3 border-r border-violet-200/50 dark:border-violet-800/50">
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
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-950/30 dark:to-purple-950/30">
              <div className="text-center">
                <MessageSquare className="w-24 h-24 text-violet-400 dark:text-violet-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-violet-800 dark:text-violet-200 mb-2">
                  Select a chat to start messaging
                </h2>
                <p className="text-violet-600 dark:text-violet-300">
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
