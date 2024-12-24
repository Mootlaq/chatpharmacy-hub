import { useState, useEffect, useCallback, useRef } from "react";
import { Message } from "@/types/chat";
import { toast } from "sonner";
import { sendTelegramMessage, type TelegramUpdate, API_URL, getChatHistory } from "@/utils/telegram";

export function useMessages(selectedChat: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const processedMessageIds = useRef(new Set<number>());

  // Load chat history when selecting a chat
  useEffect(() => {
    if (!selectedChat) return;

    const loadChatHistory = async () => {
      try {
        console.log("Loading history for chat:", selectedChat);
        
        // Clear existing state
        setMessages([]);
        processedMessageIds.current.clear();

        const history = await getChatHistory(selectedChat);
        console.log("Got history:", history);

        if (history && history.length > 0) {
          const chatMessages = history.map(update => {
            const msg = update.message!;
            processedMessageIds.current.add(msg.message_id);
            
            console.log("Processing message:", {
              id: msg.message_id,
              text: msg.text,
              date: new Date(msg.date * 1000)
            });

            return {
              id: msg.message_id,
              text: msg.text || '',
              isCustomer: true,
              timestamp: new Date(msg.date * 1000)
            };
          });

          console.log("Setting initial messages:", chatMessages);
          setMessages(chatMessages);
        } else {
          console.log("No initial messages for chat:", selectedChat);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast.error("Failed to load chat history");
      }
    };

    // Load history immediately when chat is selected
    loadChatHistory();
  }, [selectedChat]);

  // Save to localStorage
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      console.log("💾 Saving messages to localStorage:", messages);
      localStorage.setItem(`chat_messages_${selectedChat}`, JSON.stringify(messages));
    }
  }, [selectedChat, messages]);

  const updateMessages = useCallback((updates: TelegramUpdate[]) => {
    if (!selectedChat) return;

    const newMessages = updates
      .filter(update => {
        if (!update.message) return false;
        const { message_id, chat } = update.message;
        const isNew = !processedMessageIds.current.has(message_id);
        const isRelevant = chat.id === selectedChat && isNew;
        
        console.log("Filtering message:", { message_id, isNew, isRelevant });
        return isRelevant;
      })
      .map(update => {
        const msg = update.message!;
        processedMessageIds.current.add(msg.message_id);
        return {
          id: msg.message_id,
          text: msg.text || '',
          isCustomer: true,
          timestamp: new Date(msg.date * 1000)
        };
      });

    if (newMessages.length > 0) {
      setMessages(prev => {
        const allMessages = [...prev, ...newMessages];
        return allMessages.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        );
      });
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    console.log("📤 Sending message:", { chat: selectedChat, text: newMessage });
    const success = await sendTelegramMessage(selectedChat, newMessage);
    
    if (success) {
      console.log("✅ Message sent successfully");
      const newMsg: Message = {
        id: Date.now(),
        text: newMessage,
        isCustomer: false,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const updated = [...prev, newMsg];
        console.log("📊 Updated messages after sending:", updated);
        return updated;
      });
      setNewMessage("");
    }
  };

  const handleProductMessageSent = (messageText: string) => {
    const newMsg: Message = {
      id: Date.now(),
      text: messageText,
      isCustomer: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMsg]);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleProductMessageSent,
    updateMessages
  };
}