import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          {/* You can replace this with your logo */}
          <h1 className="text-xl font-bold">PharmaConnect</h1>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
} 