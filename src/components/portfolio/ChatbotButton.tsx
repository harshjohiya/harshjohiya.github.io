import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ChatbotButton() {
  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg hover-lift animate-in fade-in slide-in-from-bottom-5"
      aria-label="Open chatbot"
    >
      <Link to="/contact">
        <MessageCircle className="h-5 w-5" />
      </Link>
    </Button>
  );
}
