'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, X, Plus, MessageSquare, Settings } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatTitle {
  id: number;
  title: string;
  timestamp?: Date;
}

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

const CustomAlert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Clear',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitles, setChatTitles] = useState<ChatTitle[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to get user google_id from cookies
  const getGoogleIdFromCookies = () => {
    const match = document.cookie.match(/user_session_id=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Fetch chat titles for sidebar 
  const fetchChatTitles = async () => {
    const google_id = getGoogleIdFromCookies();
    console.log('Extracted google_id from cookies:', google_id); // Debug log
    
    if (!google_id) {
      console.error('No google_id found in cookies');
      return;
    }
    try {
      console.log('Sending request to /api/title with google_id:', google_id); // Debug log
      const res = await fetch(`${API_URL}/api/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_id }),
      });
      
      console.log('Response status:', res.status); // Debug log
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Response not ok:', res.status, errorText); // Debug log
        throw new Error(`Failed to fetch chat titles: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data); // Debug log
      
      if (data.titles) {
        const titles = data.titles.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          timestamp: new Date(chat.created_at),
        }));
        console.log('Processed titles:', titles); // Debug log
        setChatTitles(titles);
      }
    } catch (err) {
      console.error('Error fetching chat titles:', err);
      setChatTitles([]);
    }
  };

  // Fetch messages for a selected chat
  const fetchChatMessages = async (chatId: number) => {
    const google_id = getGoogleIdFromCookies();
    if (!google_id) return;
    setIsInitializing(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, google_id }),
      });
      if (!res.ok) throw new Error('Failed to fetch chat messages');
      const data = await res.json();
      if (data.messages) {
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.content,
            isUser: msg.role === 'user',
            timestamp: new Date(msg.created_at),
          }))
        );
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      setMessages([]);
    } finally {
      setIsInitializing(false);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setInputText('');
  };

  // Handle chat selection
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
    fetchChatMessages(chatId);
  };

  // Send a message
  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;
    
    const google_id = getGoogleIdFromCookies();
    if (!google_id) {
      console.error('No google_id found in cookies');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let res, data;
      if (selectedChatId) {
        // Continue existing chat
        res = await fetch(`${API_URL}/api/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: selectedChatId, 
            google_id, 
            message: userMessage.text 
          }),
        });
        data = await res.json();
        if (data.messages) {
          setMessages(
            data.messages.map((msg: any) => ({
              id: msg.id.toString(),
              text: msg.content,
              isUser: msg.role === 'user',
              timestamp: new Date(msg.created_at),
            }))
          );
        }
      } else {
        // Create new chat
        res = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userMessage.text, 
            google_id 
          }),
        });
        data = await res.json();
        
        if (data.reply) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.reply,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages([userMessage, aiMessage]);
        }
        
        // Refresh chat titles after creating new chat
        await fetchChatTitles();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Sorry, there was an error connecting to the server. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setShowClearAlert(true);
  };

  const confirmClearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Initialize on mount
  useEffect(() => {
    fetchChatTitles();
    startNewChat();
    setIsInitializing(false);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-80 flex flex-col transition-all duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <button 
              onClick={startNewChat}
              className="flex items-center space-x-2 w-full p-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              <span>New chat</span>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatTitles.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="p-2">
              {chatTitles.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                    selectedChatId === chat.id 
                      ? 'bg-gray-700 text-white' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chat.title}</p>
                    </div>
                    {chat.timestamp && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimestamp(chat.timestamp)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <Settings size={16} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedChatId 
                ? chatTitles.find(c => c.id === selectedChatId)?.title || 'Chat'
                : 'New Chat'
              }
            </h1>
          </div>
          {selectedChatId && (
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 max-w-md mx-auto px-4">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-700">How can I help you today?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <button 
                    onClick={() => setInputText("Write a professional email")}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-700 mb-1">Write a professional email</div>
                    <div className="text-gray-500">to a client about project updates</div>
                  </button>
                  <button 
                    onClick={() => setInputText("Explain quantum computing")}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-700 mb-1">Explain quantum computing</div>
                    <div className="text-gray-500">in simple terms</div>
                  </button>
                  <button 
                    onClick={() => setInputText("Create a workout plan")}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-700 mb-1">Create a workout plan</div>
                    <div className="text-gray-500">for beginners</div>
                  </button>
                  <button 
                    onClick={() => setInputText("Write a Python script")}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-700 mb-1">Write a Python script</div>
                    <div className="text-gray-500">to analyze data</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.text}</div>
                    <div
                      className={`text-xs mt-2 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 transition-colors">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message ManojAI..."
                  className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 max-h-32"
                  rows={1}
                  maxLength={4000}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={inputText.trim() === '' || isLoading}
                className={`p-3 rounded-full transition-colors ${
                  inputText.trim() === '' || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ManojAI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={showClearAlert}
        onClose={() => setShowClearAlert(false)}
        onConfirm={confirmClearChat}
        title="Clear Chat"
        message="Are you sure you want to clear all messages? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
      />
    </div>
  );
}
