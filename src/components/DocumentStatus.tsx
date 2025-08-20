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
    const handleRefreshStatus = () => {
      setLoading(true);
      setTimeout(() => checkStatus(0), 1000); // Wait a bit before checking
    };
    window.addEventListener("document-uploaded", handleRefreshStatus);

    return () => {
      window.removeEventListener("document-uploaded", handleRefreshStatus);
    };
  }, []);

  const checkStatus = async (retryCount = 0) => {
    try {
      const response = await fetch("/api/status", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const result: StatusResponse = await response.json();
      setStatus(result);
    } catch (error) {
      console.error("Error checking document status:", error);

      // Retry a few times before giving up
      if (retryCount < 2) {
        setTimeout(() => checkStatus(retryCount + 1), 1000);
        return;
      }

      setStatus({ hasDocument: false });
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
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

  const filename = status.documentInfo?.filename;
  const displayName = filename
    ? filename.length > 25
      ? `${filename.substring(0, 22)}...`
      : filename
    : "Documento cargado";

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span
          title={
            filename
              ? `${filename} - ${status.documentInfo?.chunks} chunks`
              : "Documento cargado"
          }
          className="font-medium text-green-700"
        >
          {displayName}
        </span>
      </div>
    </div>
  );
}
