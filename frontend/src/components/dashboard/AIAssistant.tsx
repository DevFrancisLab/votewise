import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Civic Assistant. How can I help you with voting information today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const suggestedQuestions = [
    "What are the key issues in this election?",
    "Compare candidates on climate policy",
    "How does voting work in my area?",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question. I'm analyzing the latest data to provide you with accurate information. Please give me a moment...",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-black">AI Assistant</h1>

      {/* Chat messages */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-y-auto p-4 space-y-4 mb-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "ai"
                  ? "text-black"
                  : "text-black"
              }`}
              style={{
                backgroundColor: message.sender === "ai" ? "#F0F0F0" : "#FFEEEE",
              }}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="px-3 py-1 bg-gray-200 text-black rounded-full text-sm hover:bg-gray-300 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything about voting..."
          className="flex-1"
        />
        <Button onClick={sendMessage} className="bg-red-600 hover:bg-red-700">
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;