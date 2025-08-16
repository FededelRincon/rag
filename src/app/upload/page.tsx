"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

interface ProcessingInfo {
  chunks: number;
  filename: string;
  documentId: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [processingInfo, setProcessingInfo] = useState<ProcessingInfo | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError("Por favor selecciona un archivo PDF válido menor a 10MB");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus("success");
        setProcessingInfo(result.documentInfo);
        // Auto-navigate to chat after 2 seconds
        setTimeout(() => {
          router.push("/chat");
        }, 2000);
      } else {
        setUploadStatus("error");
        setError(result.error || "Error procesando el archivo");
      }
    } catch (err) {
      setUploadStatus("error");
      setError("Error de conexión. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Subir Documento PDF
      </h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-6xl">📄</div>
          {isDragActive ? (
            <p className="text-lg text-blue-600">Suelta el archivo aquí...</p>
          ) : (
            <div>
              <p className="text-lg text-gray-600">
                Arrastra un archivo PDF aquí, o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mt-2">Máximo 10MB</p>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Archivo seleccionado:</h3>
          <p>
            <strong>Nombre:</strong> {file.name}
          </p>
          <p>
            <strong>Tamaño:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>

          <button
            onClick={handleUpload}
            disabled={uploadStatus === "uploading"}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === "uploading"
              ? "Procesando..."
              : "Procesar Documento"}
          </button>
        </div>
      )}

      {uploadStatus === "success" && processingInfo && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            ¡Documento procesado exitosamente!
          </h3>
          <p className="text-green-700">
            <strong>Archivo:</strong> {processingInfo.filename}
          </p>
          <p className="text-green-700">
            <strong>Chunks generados:</strong> {processingInfo.chunks}
          </p>
          <p className="text-sm text-green-600 mt-2">
            Redirigiendo al chat en unos segundos...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
