"use client";
import { useState } from "react";
import { Bot, Sparkle, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateAIResponse() {
    setLoading(true);
    setResponse(null);
    // Real call: would POST to server action/api that invokes OpenAI API w/ prompt, returns answer.
    // For demo, fake delay and canned response
    await new Promise(r => setTimeout(r, 1200));
    setResponse(
      prompt
        ? "Here's a creative marketing idea: Launch a '30-day Brand Sprint'—position your client's campaign around daily micro-stories, leveraging UGC, social snippets, and interactive polls via Marketraze's automation to build fast audience engagement."
        : null
    );
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Bot className="size-6 text-primary" />
            Marketraze AI Assistant
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Get instant AI marketing ideas, campaign copy, or workflow suggestions.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <Sparkle className="size-4 mr-1" />
          Powered by OpenAI
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Try an AI Request</CardTitle>
          <CardDescription>
            Enter a short prompt below & Marketraze will generate ready-to-use marketing content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g. Generate a campaign idea for a summer product launch..."
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 items-end">
          <Button onClick={generateAIResponse} disabled={!prompt?.trim() || loading}>
            <Send className="size-4 mr-1" /> {loading ? "Thinking..." : "Generate"}
          </Button>
          {response && (
            <div className="bg-accent/35 rounded-md px-3 py-2 w-full animate-fade-slide text-sm text-foreground">
              {response}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}