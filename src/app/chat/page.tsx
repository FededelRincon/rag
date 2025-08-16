"use client";

import { useState, useEffect, useRef } from "react";
import ErrorAlert from "../../components/ErrorAlert";

interface Message {
  role: "user" | "assistant";
  content: string;
  similarity?: number;
  sourceChunk?: string;
}

interface DocumentInfo {
  filename: string;
  chunks: number;
  uploadedAt: string;
}

interface StatusResponse {
  hasDocument: boolean;
  documentInfo?: DocumentInfo;
}

interface ChatResponse {
  answer: string;
  similarity: number;
  chunk: string;
  error?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasDocument, setHasDocument] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkDocumentStatus();

    // Poll for document status changes every 5 seconds
    const interval = setInterval(checkDocumentStatus, 5000);

    return () => clearInterval(interval);
  }, [currentDocumentId]);

  const checkDocumentStatus = async () => {
    try {
      const response = await fetch("/api/status");
      const result: StatusResponse = await response.json();

      // Check if document changed (new document uploaded)
      if (result.hasDocument && result.documentInfo) {
        const newDocumentId = `${result.documentInfo.filename}_${result.documentInfo.uploadedAt}`;

        if (currentDocumentId && currentDocumentId !== newDocumentId) {
          // New document detected, clear chat history
          setMessages([]);
          setInput("");
          setConnectionError(null);
        }

        setCurrentDocumentId(newDocumentId);
      } else {
        // No document, clear everything
        if (currentDocumentId) {
          setMessages([]);
          setInput("");
          setConnectionError(null);
          setCurrentDocumentId(null);
        }
      }

      setHasDocument(result.hasDocument);
    } catch (error) {
      console.error("Error checking document status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    setConnectionError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChatResponse = await response.json();

      if (result.error) {
        const errorMessage: Message = {
          role: "assistant",
          content: result.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: result.answer,
          similarity: result.similarity,
          sourceChunk: result.chunk,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      let errorMsg = "Error de conexión. Por favor intenta de nuevo.";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMsg =
            "Sin conexión a internet. Verifica tu conexión e intenta de nuevo.";
        } else if (error.message.includes("HTTP error")) {
          errorMsg =
            "Error del servidor. Por favor intenta de nuevo más tarde.";
        }
      }

      setConnectionError(errorMsg);
      const errorMessage: Message = {
        role: "assistant",
        content: errorMsg,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.role === "user") {
        setInput(lastUserMessage.content);
        // Remove the last error message
        setMessages((prev) => prev.slice(0, -1));
      }
    }
    setConnectionError(null);
  };

  if (!hasDocument) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            No hay documento cargado
          </h2>
          <p className="text-yellow-700 mb-6">
            Necesitas subir un documento PDF antes de poder hacer preguntas.
          </p>
          <a
            href="/upload"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Subir Documento
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Chat con tu Documento
      </h1>

      <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>¡Haz tu primera pregunta sobre el documento!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.similarity && (
                    <div className="mt-2 text-sm opacity-75">
                      <p>Similitud: {(message.similarity * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {connectionError && (
        <div className="mb-4">
          <ErrorAlert
            title="Error de conexión"
            message={connectionError}
            type="error"
            onRetry={handleRetryLastMessage}
            onDismiss={() => setConnectionError(null)}
            retryText="Reintentar última pregunta"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
