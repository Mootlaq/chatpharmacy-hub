import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log("Rendering messages count:", messages.length);
  messages.forEach((msg, index) => {
    console.log(`Message ${index + 1}:`, msg);
  });

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isCustomer ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
              msg.isCustomer
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs mt-1 opacity-70 block">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* Scroll anchor */}
    </div>
  );
};