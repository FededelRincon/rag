"use client";

import { useState, useEffect } from "react";

interface DocumentInfo {
  filename: string;
  chunks: number;
  uploadedAt: string;
}

interface StatusResponse {
  hasDocument: boolean;
  documentInfo?: DocumentInfo;
}

export default function DocumentStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();

    // Listen for custom events to refresh status when needed
    const handleRefreshStatus = () => checkStatus();
    window.addEventListener("document-uploaded", handleRefreshStatus);

    return () => {
      window.removeEventListener("document-uploaded", handleRefreshStatus);
    };
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/status");
      const result: StatusResponse = await response.json();
      setStatus(result);
    } catch (error) {
      console.error("Error checking document status:", error);
      setStatus({ hasDocument: false });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
        <span>Verificando...</span>
      </div>
    );
  }

  if (!status?.hasDocument) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Sin documento</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span
        title={`${status.documentInfo?.filename} - ${status.documentInfo?.chunks} chunks`}
      >
        Documento cargado
      </span>
    </div>
  );
}
