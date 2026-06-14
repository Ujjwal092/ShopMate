import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    if (!message.trim() || thinking) return;

    const userMessage = message.trim();
    setChat((prev) => [...prev, { from: "user", text: userMessage }]);
    setMessage("");
    setThinking(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/product/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: data?.reply || "Sorry, I couldn't process that. Try again!",
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { from: "bot", text: "Connection error — please try again." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {/* Launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-background" />
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:right-5 z-50 flex w-auto sm:w-[330px] h-[min(480px,calc(100vh-1.5rem))] sm:h-[460px] flex-col overflow-hidden rounded-2xl border border-[hsla(var(--glass-border))] bg-card/95 backdrop-blur-xl shadow-[var(--shadow-elegant)]"
          style={{ animation: "chat-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <style>{`
            @keyframes chat-pop {
              from { opacity: 0; transform: translateY(10px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes dot-bounce {
              0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
              40% { transform: translateY(-3px); opacity: 1; }
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[hsla(var(--glass-border))] gradient-primary px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">
                🛍️
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">
                  CartSyy Assistant
                </h3>
                <p className="flex items-center gap-1.5 text-[11px] text-white/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2.5 overflow-y-auto bg-background/40 px-3 py-3 scrollbar-hide">
            {chat.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-lg">
                  👋
                </div>
                <p className="text-sm font-medium text-foreground">
                  Hey, I'm here to help
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ask about products, orders, prices, or recommendations.
                </p>
              </div>
            )}

            {chat.map((c, i) => (
              <div
                key={i}
                className={`flex ${c.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    c.from === "user"
                      ? "rounded-br-sm gradient-primary text-primary-foreground"
                      : "rounded-bl-sm glass text-foreground"
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-xl rounded-bl-sm glass px-3.5 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      style={{
                        animation: "dot-bounce 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-[hsla(var(--glass-border))] bg-card/80 p-2.5">
            <input
              ref={inputRef}
              className="flex-1 rounded-full border border-[hsla(var(--glass-border))] bg-secondary/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-[hsl(var(--ring))] disabled:opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={thinking}
            />
            <button
              onClick={sendMessage}
              disabled={thinking || !message.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-primary-foreground transition-opacity disabled:opacity-30"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
