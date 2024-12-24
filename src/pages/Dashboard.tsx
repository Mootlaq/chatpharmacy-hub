import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessages } from "@/components/ChatMessages";
import { ProductsPanel } from "@/components/ProductsPanel";
import { ChatList } from "@/components/ChatList";
import { ChatInput } from "@/components/ChatInput";
import { useChats } from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Header } from "@/components/Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedChat');
    return saved ? parseInt(saved) : null;
  });
  
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    handleProductMessageSent,
    updateMessages 
  } = useMessages(selectedChat);

  const { chats, getUpdates, handleDeleteChat } = useChats(updateMessages);

  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem('selectedChat', selectedChat.toString());
    } else {
      localStorage.removeItem('selectedChat');
    }
  }, [selectedChat]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }
    
    // Initial fetch
    getUpdates();

    // Set up polling
    const pollInterval = setInterval(() => {
      getUpdates();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [navigate, getUpdates]);

  const handleSelectChat = (chatId: number) => {
    console.log("Selecting chat:", chatId);
    setSelectedChat(chatId);
  };

  const handleReset = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Reset states
    setSelectedChat(null);
    setMessages([]);
    setNewMessage("");
    
    // Fetch updates again
    getUpdates();
    
    toast.success("All chats and messages cleared");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onReset={handleReset} />
      
      <main className="flex flex-1 h-[calc(100vh-4rem)]">
        {/* Left Pane - Chat List */}
        <aside className="w-80 border-r flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChatList 
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </div>
        </aside>

        {/* Middle Pane - Chat Messages */}
        <section className="flex-1 flex flex-col border-r">
          {selectedChat ? (
            <>
              <header className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                  {chats.find(c => c.id === selectedChat)?.name}
                </h2>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="flex flex-col min-h-full justify-end">
                  <ChatMessages messages={messages} />
                </div>
              </div>

              <footer className="px-6 py-4 border-t mt-auto">
                <ChatInput 
                  newMessage={newMessage}
                  onMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                />
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
              Select a conversation to start chatting
            </div>
          )}
        </section>

        {/* Right Pane - Products */}
        <aside className="w-80 flex flex-col">
          <ProductsPanel 
            selectedChatId={selectedChat} 
            onMessageSent={handleProductMessageSent}
          />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;