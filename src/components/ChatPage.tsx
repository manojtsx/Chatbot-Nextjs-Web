'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSavedMessages = async () => {
    try {
      const savedMessages = localStorage.getItem('chat_messages');
      
      if (!savedMessages) {
        // If no saved messages, show welcome message
        const welcomeMessage: Message = {
          id: '1',
          text: 'Hello! How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        saveMessagesToStorage([welcomeMessage]);
      } else {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
      // Fallback to welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: 'Hello! How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    loadSavedMessages();
  }, []);

  const saveMessagesToStorage = (newMessages: Message[]) => {
    try {
      const messagesForStorage = newMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      localStorage.setItem('chat_messages', JSON.stringify(messagesForStorage));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessagesToStorage(updatedMessages);
    
    const currentInput = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Send message to Flask backend
      const response = await fetch(
        API_URL + '/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      let responseText = '';
      
      // Handle different response formats from Flask server
      if (typeof data === 'string') {
        responseText = data;
      } else if (data.reply) {
        responseText = data.reply;
      } else if (data.response) {
        responseText = data.response;
      } else if (data.message) {
        responseText = data.message;
      } else {
        responseText = JSON.stringify(data);
      }

      // Format the response text
      const formattedResponse = formatResponseText(responseText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: formattedResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessagesToStorage(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error connecting to the server. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessagesToStorage(finalMessages);
      
      alert('Connection Error: Unable to connect to the chat server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseText = (text: string): string => {
    if (!text) return '';
    
    return text
      // Handle markdown bold formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Handle markdown italic formatting
      .replace(/\*(.*?)\*/g, '$1')
      // Handle escaped quotes
      .replace(/\\"/g, '"')
      // Handle escaped newlines
      .replace(/\\n/g, '\n')
      // Handle escaped tabs
      .replace(/\\t/g, '\t')
      // Handle escaped backslashes
      .replace(/\\\\/g, '\\')
      // Handle bullet points and lists
      .replace(/^\s*[-*+]\s+/gm, '• ')
      // Handle numbered lists
      .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + ' ')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Trim whitespace
      .trim();
  };

  const handleClearChat = () => {
    setShowClearAlert(true);
  };

  const confirmClearChat = () => {
    try {
      localStorage.removeItem('chat_messages');
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: 'Hello! How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat history.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm opacity-80">Online</span>
          </div>
          <h1 className="text-xl font-bold flex-1 text-center">Manoj Chat</h1>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            title="Clear chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                message.isUser
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
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
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 flex items-center space-x-2">
              <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 max-h-32"
              rows={1}
              maxLength={500}
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
