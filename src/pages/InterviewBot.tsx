import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// ✅ Replace this with your actual Groq API Key
const GROQ_API_KEY = "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";

// Function to communicate with Groq API
const callGroqAPI = async (conversationHistory) => {
  try {
    // ✅ Ensure valid roles ("system", "user", "assistant")
    const formattedHistory = conversationHistory.slice(-5).map((msg) => ({
      role: msg.role === "bot" ? "assistant" : msg.role, // ✅ Convert "bot" to "assistant"
      content: msg.content.length > 500 ? msg.content.slice(0, 500) + "..." : msg.content // ✅ Shorten long answers
    }));

    const requestBody = {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are an AI-powered interview bot conducting a structured interview. Use previous responses to create progressively deeper questions. Do not repeat the same question. If the user expresses uncertainty, simplify the next question." },
        ...formattedHistory
      ],
      temperature: 0.5, // ✅ Lowered temperature for more structured questions
      max_tokens: 300
    };

    console.log("🛠️ Sending API request with body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("🛠️ API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 API Error Response:", errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log("🛠️ Groq API Raw Response:", JSON.stringify(responseData, null, 2));

    let nextQuestion = responseData.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a question.";
    return nextQuestion;
  } catch (error) {
    console.error("🚨 Error calling Groq API:", error);
    return "I'm sorry, but I couldn't generate the next question. Let's continue with a general question.";
  }
};

const InterviewBot = () => {
  const [jobRole, setJobRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Save interview session to Supabase
  const saveInterviewSession = async () => {
    if (!user) return;

    try {
      await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          job_role: jobRole,
          messages: messages
        });
    } catch (error) {
      console.error('Error saving interview session:', error);
    }
  };

  // ✅ Start interview with first question from Groq API
  const startInterview = async () => {
    if (!jobRole.trim()) return;

    setIsStarted(true);
    setMessages([{ role: 'bot', content: `I'll be interviewing you for the ${jobRole} position. Let's begin...` }]);

    setIsLoading(true);
    const firstQuestion = await callGroqAPI([{ role: "user", content: `The user wants to be interviewed for the ${jobRole} role.` }]);
    setMessages(prev => [...prev, { role: 'bot', content: firstQuestion }]);
    setIsLoading(false);
  };

  // ✅ Handle user responses & fetch the next dynamic question
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Get next question from Groq API
    const nextQuestion = await callGroqAPI([...messages, userMessage]);

    // ✅ Prevent repeating the same question
    const lastBotMessages = messages
      .filter((msg) => msg.role === "bot")
      .map((msg) => msg.content)
      .slice(-3);

    let finalQuestion = nextQuestion;
    if (lastBotMessages.includes(nextQuestion)) {
      finalQuestion = "Let's explore another aspect. Can you describe a technical challenge you overcame recently?";
    }

    setMessages(prev => [...prev, { role: 'bot', content: finalQuestion }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-medium">Interview Bot</CardTitle>
              <CardDescription>
                Practice your interview skills with our AI-powered interview bot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isStarted ? (
                <div className="space-y-4">
                  <Input
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Enter job role (e.g., Software Engineer)"
                    className="w-full"
                  />
                  <Button onClick={startInterview} disabled={!jobRole.trim()} className="w-full text-white">
                    Start Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg h-96 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex items-start max-w-[80%] ${message.role === 'bot' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'} p-3 rounded-lg`}>
                          {message.role === 'bot' ? <Bot className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                          <div>{message.content}</div>
                        </div>
                      </div>
                    ))}
                    {isLoading && <div className="text-center text-gray-500">Generating next question...</div>}
                    <div ref={messagesEndRef} />
                  </div>
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full"
                  />
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InterviewBot;
