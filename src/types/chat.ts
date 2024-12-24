export interface Message {
  id: number;
  text: string;
  isCustomer: boolean;
  timestamp: Date;
}

export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
}

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
  update_id: number;
  message?: TelegramMessage;
}