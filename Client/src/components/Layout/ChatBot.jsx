import { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [thinking, setThinking] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setChat(prev => [...prev, { from: "user", text: message }]);
    setMessage("");
    setThinking(true);

    try {
      const res = await fetch(
        "https://ujjwal-090223.app.n8n.cloud/webhook/0f5fb4d2-f2be-4020-adaf-3e5ae9bcee30/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }
      );

      const data = await res.json();

      setChat(prev => [
        ...prev,
        { from: "bot", text: data.reply }
      ]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { from: "bot", text: "⚠️ Something went wrong" }
        
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {/* 🔹 Chat Bubble */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg- text-white px-5 py-3 rounded-full cursor-pointer shadow-lg z-50 hover:scale-105 transition"
        >
          🤖 CartSyy-AI
        </div>
      )}

      {/* 🔹 Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-gray-100 shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold">CartSyy-AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  c.from === "user"
                    ? "ml-auto bg-black text-white"
                    : "mr-auto bg-white border"
                }`}
              >
                {c.text}
              </div>
            ))}

            {thinking && (
              <div className="mr-auto bg-white border px-3 py-2 rounded-lg text-sm italic animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask CartSyy-AI..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
