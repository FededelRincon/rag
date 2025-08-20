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
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
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

    // Listen for document upload events to refresh status
    const handleDocumentUploaded = () => {
      checkDocumentStatus();
      // Clear chat history when new document is uploaded
      setMessages([]);
      setInput("");
      setConnectionError(null);
    };

    window.addEventListener("document-uploaded", handleDocumentUploaded);

    return () => {
      window.removeEventListener("document-uploaded", handleDocumentUploaded);
    };
  }, []);

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
        setDocumentInfo(result.documentInfo);
      } else {
        // No document, clear everything
        if (currentDocumentId) {
          setMessages([]);
          setInput("");
          setConnectionError(null);
          setCurrentDocumentId(null);
          setDocumentInfo(null);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              No hay documento cargado
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Sube un documento PDF para comenzar a hacer preguntas y obtener
              respuestas inteligentes.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Subir Documento
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Chat con{" "}
            {documentInfo?.filename ? (
              <span className="text-blue-600" title={documentInfo.filename}>
                "
                {documentInfo.filename.length > 30
                  ? `${documentInfo.filename.substring(0, 27)}...`
                  : documentInfo.filename}
                "
              </span>
            ) : (
              "tu Documento"
            )}
          </h1>
          <p className="text-slate-600">
            Haz preguntas inteligentes y obtén respuestas precisas
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-y-auto mb-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                ¡Comienza la conversación!
              </h3>
              <p className="text-slate-500 max-w-md">
                Haz tu primera pregunta sobre el documento y obtén respuestas
                detalladas basadas en su contenido.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-3xl ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700"
                          : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <p
                        className={`whitespace-pre-wrap leading-relaxed ${
                          message.role === "user"
                            ? "text-white"
                            : "text-slate-700"
                        }`}
                      >
                        {message.content}
                      </p>
                      {message.similarity && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4 text-emerald-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-emerald-600">
                                Similitud:{" "}
                                {(message.similarity * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-slate-600 font-medium">
                      Analizando documento...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Alert */}
        {connectionError && (
          <div className="mb-6">
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

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Enviar</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
