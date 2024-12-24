import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chat } from "@/types/chat";

interface ChatListProps {
  chats: Chat[];
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  onDeleteChat?: (chatId: number) => void;
}

export const ChatList = ({ 
  chats, 
  selectedChat, 
  onSelectChat,
  onDeleteChat 
}: ChatListProps) => {
  console.log("Rendering chat list:", chats);

  const handleDelete = (e: React.MouseEvent, chatId: number) => {
    console.log("Delete button clicked for chat:", chatId);
    e.stopPropagation(); // Prevent chat selection when clicking delete
    onDeleteChat?.(chatId);
  };

  return (
    <div className="w-80 border-r glass-panel">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 cursor-pointer transition-colors hover:bg-secondary rounded-lg mb-2 ${
                selectedChat === chat.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {chat.unread > 0 && (
                    <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs">
                      {chat.unread}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleDelete(e, chat.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};