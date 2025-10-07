"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Box } from "../ui/box";
import {
  Send,
  Bot,
  ArrowLeft,
  Sparkles,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import pdfAPI from "../../lib/pdf";

// Function to format message content with proper HTML structure
const formatMessageContent = (content) => {
  if (!content) return "";

  // Convert markdown-style formatting to HTML
  let formattedContent = content
    // Convert ### headers to h3 tags
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold text-gray-800 mb-2 mt-4 first:mt-0">$1</h3>'
    )
    // Convert ## headers to h4 tags
    .replace(
      /^## (.+)$/gm,
      '<h4 class="text-base font-medium text-gray-700 mb-2 mt-3">$1</h4>'
    )
    // Convert # headers to h5 tags
    .replace(
      /^# (.+)$/gm,
      '<h5 class="text-sm font-medium text-gray-600 mb-1 mt-2">$1</h5>'
    )
    // Convert **text** to <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Convert *text* to <em>text</em>
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Convert bullet points (•) to proper list items with styling
    .replace(
      /^•\s*(.+)$/gm,
      '<li class="text-sm text-gray-700 mb-1 flex items-start"><span class="text-blue-500 mr-2">•</span>$1</li>'
    )
    // Convert numbered lists
    .replace(
      /^\d+\. (.+)$/gm,
      '<li class="text-sm text-gray-700 mb-1 flex items-start"><span class="text-gray-500 mr-2">$&</span></li>'
    )
    // Convert line breaks to proper spacing
    .replace(/\n/g, "<br />")
    // Group consecutive list items into proper ul tags
    .replace(
      /(<li[^>]*>.*?<\/li>)(<br \/>)(<li[^>]*>.*?<\/li>)/gs,
      '<ul class="space-y-1 mb-3">$1$2$3</ul>'
    )
    // Clean up multiple line breaks
    .replace(/(<br \/>){3,}/g, "<br /><br />");

  return formattedContent;
};

export default function FinChatPage({
  onBack,
  selectedMonth,
  selectedMonthKey,
  selectedPage,
  isFinancialSelected,
}) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebox, setShowSidebox] = useState(true);
  const scrollAreaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      // Pass the question directly, let pdf.js handle month context
      const aiResponse = await pdfAPI.askQuestion(question, selectedMonthKey);

      let aiContent = "I've processed your question and here's what I found...";

      if (aiResponse.output) {
        aiContent = aiResponse.output;
      } else if (aiResponse.answer) {
        aiContent = aiResponse.answer;
      } else if (aiResponse.response) {
        aiContent = aiResponse.response;
      } else if (aiResponse.message) {
        aiContent = aiResponse.message;
      } else if (aiResponse.content) {
        aiContent = aiResponse.content;
      } else if (aiResponse.chatInput) {
        aiContent = aiResponse.chatInput;
      } else if (aiResponse.data) {
        if (aiResponse.data.output) aiContent = aiResponse.data.output;
        else if (aiResponse.data.answer) aiContent = aiResponse.data.answer;
        else if (aiResponse.data.response) aiContent = aiResponse.data.response;
        else if (aiResponse.data.message) aiContent = aiResponse.data.message;
      } else if (typeof aiResponse === "string") {
        aiContent = aiResponse;
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiContent,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to get AI answer:", error);
      const errorResponse = {
        id: Date.now() + 1,
        type: "ai",
        content:
          error.message ||
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prev) => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const handleEndChat = () => {
    setChatHistory([]);
    setQuestion("");
    if (onBack) {
      onBack();
    } else {
      router.push("/dashboard");
    }
  };

  const toggleSidebox = () => {
    setShowSidebox(!showSidebox);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      }
    }
  }, [chatHistory]);

  // Scroll to bottom when loading state changes
  useEffect(() => {
    if (!isLoading && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      }
    }
  }, [isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Fixed Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg flex-shrink-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">FinChat Data Assistant</h1>
                  <p className="text-purple-100">
                    AI-powered financial document analysis
                  </p>
                  {selectedMonth && (
                    <p className="text-purple-200 text-sm mt-1">
                      Analyzing:{" "}
                      {isFinancialSelected
                        ? `Financial Page ${selectedPage}`
                        : selectedMonthKey}{" "}
                      Dashboard
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* End Chat Button */}
            <Button
              onClick={handleEndChat}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <X className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">End Chat</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Chat with Input Below */}
      <div
        className={`flex-1 flex flex-col gap-6 p-6 overflow-hidden transition-all duration-300 ${
          showSidebox ? "mr-80" : "mr-0"
        }`}
      >
        <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
          <CardHeader className="flex-shrink-0 border-b bg-gray-50/50">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Chat Assistant
              </CardTitle>
              {chatHistory.length > 0 && (
                <Button
                  onClick={scrollToBottom}
                  variant="outline"
                  size="sm"
                  className="p-2 hover:bg-gray-200 bg-white shadow-sm"
                  title="Scroll to bottom"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Scrollable Chat Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="p-6 space-y-4 min-h-full">
                <AnimatePresence>
                  {chatHistory.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-500 py-12"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      </motion.div>
                      <p className="text-lg font-medium mb-2">
                        Welcome to FinChat!
                      </p>
                      <p className="text-sm">
                        {selectedMonth
                          ? `Ask questions about your ${
                              isFinancialSelected
                                ? `Financial Page ${selectedPage}`
                                : selectedMonthKey
                            } Dashboard`
                          : "Start a conversation by asking a question about your financial documents"}
                      </p>
                    </motion.div>
                  ) : (
                    chatHistory.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        className={`flex gap-3 ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <Box
                          variant={message.type === "user" ? "user" : "ai"}
                          padding="md"
                          className="max-w-[85%]"
                        >
                          <div
                            className={`text-sm leading-relaxed ${
                              message.type === "user"
                                ? "text-white"
                                : "text-gray-800"
                            } ${message.type === "ai" ? "ai-message" : ""}`}
                            dangerouslySetInnerHTML={{
                              __html: formatMessageContent(message.content),
                            }}
                          />
                          <p
                            className={`text-xs opacity-70 mt-2 ${
                              message.type === "user"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </Box>
                      </motion.div>
                    ))
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <Box variant="loading" padding="md">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            AI is thinking...
                          </span>
                        </div>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area - Below Chat Messages */}
        <Card className="flex-shrink-0 shadow-lg">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="flex-1">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about your financial documents..."
                  className="min-h-[60px] max-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!question.trim() || isLoading}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 h-[60px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* How to Use FinChat - Right Side */}
      <motion.div
        initial={{ x: showSidebox ? 0 : 320 }}
        animate={{ x: showSidebox ? 0 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-0 top-24 z-20 h-[calc(100vh-6rem)] w-80 bg-white shadow-2xl border-l border-gray-200"
      >
        <div className="h-full flex flex-col">
          {/* Sidebox Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">
                How to Use FinChat
              </h3>
            </div>
            <Button
              onClick={toggleSidebox}
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebox Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Getting Started */}
              <Box variant="subtle" padding="md">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Getting Started
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Ask questions about your financial data</p>
                  <p>• Get AI-powered insights and analysis</p>
                </div>
              </Box>

              {/* Example Questions */}
              <Box variant="subtle" padding="md">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-500" />
                  Example Questions
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• "What's my total revenue for July?"</p>
                  <p>• "Show me expenses by category"</p>
                  <p>• "What's my profit margin trend?"</p>
                  <p>• "Analyze my cash flow"</p>
                </div>
              </Box>

              {/* Features */}
              <Box variant="subtle" padding="md">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-green-500" />
                  Key Features
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Natural language queries</p>
                  <p>• Real-time financial analysis</p>
                  <p>• Document-based insights</p>
                  <p>• Professional formatting</p>
                </div>
              </Box>

              {/* Tips */}
              <Box variant="subtle" padding="md">
                <h4 className="flex items-center gap-2 font-medium text-gray-800 mb-3">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Pro Tips
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Be specific with your questions</p>
                  <p>• Ask for comparisons and trends</p>
                  <p>• Request visualizations when needed</p>
                  <p>• Use follow-up questions for deeper insights</p>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebox Toggle Button - Right Side */}
      <motion.div
        initial={{ x: showSidebox ? 0 : 320 }}
        animate={{ x: showSidebox ? 0 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-80 top-24 z-20"
      >
        <Button
          onClick={toggleSidebox}
          variant="outline"
          size="sm"
          className="rounded-r-none border-r-0 shadow-lg bg-white hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Custom CSS for better scrollbar and formatted content */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Formatted content styling */
        .ai-message h3 {
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .ai-message h3:first-child {
          margin-top: 0;
        }

        .ai-message h4 {
          color: #374151;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          margin-top: 0.75rem;
        }

        .ai-message h5 {
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          margin-top: 0.5rem;
        }

        .ai-message ul {
          margin-bottom: 0.75rem;
        }

        .ai-message li {
          margin-bottom: 0.25rem;
        }

        .ai-message strong {
          font-weight: 600;
        }

        .ai-message em {
          font-style: italic;
        }
      `}</style>
    </motion.div>
  );
}
