import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Loader2, MessageCircle, Send, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

interface ChatApiResponse {
  answer: string;
}

const FALLBACK_ANSWER = "I don't have information about that yet.";
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Hi, I'm Harsh's AI portfolio assistant. Ask me about projects, skills, or experience.",
  },
];
const SUGGESTED_PROMPTS = [
  "What are Harsh's top AI projects?",
  'What technologies does Harsh use?',
  "Tell me about Harsh's deep learning experience.",
  "What is Harsh's education background?",
];

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapHistory(messages: ChatMessage[]): ChatHistoryMessage[] {
  return messages
    .filter((message) => message.id !== 'welcome')
    .map(({ role, content }) => ({ role, content }));
}

export function ChatbotButton() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const messagesRef = useRef<HTMLDivElement>(null);

  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL ?? 'http://127.0.0.1:8000/chat';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || isSending) return;

    const history = mapHistory(messages);
    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = (await response.json()) as Partial<ChatApiResponse>;
      const answer =
        typeof data.answer === 'string' && data.answer.trim() ? data.answer.trim() : FALLBACK_ANSWER;

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'assistant',
          content: answer,
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'assistant',
          content: `I couldn't connect to the chatbot service. Please try again. (${errorMessage})`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      style={{ zIndex: 2147483647 }}
    >
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-[24rem] overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Harsh AI Assistant</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {messages.length <= 2 && (
            <div className="border-b border-border/60 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested prompts</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto whitespace-normal py-1.5 text-left text-xs"
                    onClick={() => void sendMessage(prompt)}
                    disabled={isSending}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesRef} className="h-[55vh] max-h-80 space-y-3 overflow-y-auto px-4 py-3 sm:h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="mt-1 rounded-full bg-primary/10 p-1.5 text-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <div className="mt-1 rounded-full bg-muted p-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border/60 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Harsh..."
                className="h-10"
                disabled={isSending}
                aria-label="Chat input"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={isSending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full border border-border bg-primary text-primary-foreground shadow-2xl hover-lift"
        style={{ zIndex: 2147483647 }}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
    ,
    document.body
  );
}
