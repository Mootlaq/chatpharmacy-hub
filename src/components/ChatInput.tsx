import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const ChatInput = ({ newMessage, onMessageChange, onSendMessage }: ChatInputProps) => {
  return (
    <div className="p-4 border-t glass-panel">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          }}
        />
        <Button onClick={onSendMessage}>Send</Button>
      </div>
    </div>
  );
};