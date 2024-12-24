import { toast } from "sonner";
import type { Chat } from "@/types/chat";

export interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    first_name?: string;
    username?: string;
  };
  text?: string;
  date: number;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  update_id: number;
}

export const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
export const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export const processTelegramUpdates = (updates: TelegramUpdate[]): Chat[] => {
  console.log("Processing updates:", updates);
  
  if (!Array.isArray(updates)) {
    console.log("Invalid updates format:", updates);
    return [];
  }

  // Create a Map to store unique chats by ID with their latest message
  const chatMap = new Map<number, Chat>();

  updates.forEach(update => {
    if (!update?.message?.chat) {
      console.log("Skipping update without chat:", update);
      return;
    }

    const chatId = update.message.chat.id;
    const existingChat = chatMap.get(chatId);
    
    chatMap.set(chatId, {
      id: chatId,
      name: update.message.chat.first_name || update.message.chat.username || 'Unknown User',
      lastMessage: update.message.text || '',
      unread: existingChat ? existingChat.unread + 1 : 1,
    });
  });

  const chats = Array.from(chatMap.values());
  console.log("Processed chats:", chats);
  return chats;
};

export const sendTelegramMessage = async (chatId: number, text: string) => {
  try {
    const response = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      toast.success("Message sent successfully");
      return true;
    } else {
      console.error("Failed to send message:", data);
      toast.error("Failed to send message");
      return false;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Error sending message");
    return false;
  }
};

export const getChatHistory = async (chatId: number) => {
  try {
    // First get all updates without offset
    const response = await fetch(`${API_URL}/getUpdates?limit=100`);
    const data = await response.json();
    
    if (data.ok) {
      console.log("All updates:", data.result);
      
      // Filter and sort messages for this chat
      const chatMessages = data.result
        .filter(update => {
          const msg = update.message;
          if (!msg) return false;
          
          const isForThisChat = msg.chat.id === chatId;
          const hasText = Boolean(msg.text);
          
          console.log("Checking message:", {
            chatId: msg.chat.id,
            messageId: msg.message_id,
            text: msg.text,
            isForThisChat,
            hasText
          });
          
          return isForThisChat && hasText;
        })
        .sort((a, b) => {
          // Ensure oldest messages come first
          return (a.message?.date || 0) - (b.message?.date || 0);
        });

      console.log("Chat history for", chatId, ":", chatMessages);
      
      if (chatMessages.length === 0) {
        console.log("No messages found for chat:", chatId);
      }

      return chatMessages;
    } else {
      console.error("Failed to get updates:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};