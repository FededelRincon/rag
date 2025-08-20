"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import ErrorAlert from "../../components/ErrorAlert";

interface ProcessingInfo {
  chunks: number;
  filename: string;
  documentId: string;
}

type UploadStatus = "idle" | "success" | "error";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [processingInfo, setProcessingInfo] = useState<ProcessingInfo | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(10);
  const [autoRedirectCancelled, setAutoRedirectCancelled] = useState(false);
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

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setIsUploading(false);
        setUploadStatus("success");
        setProcessingInfo(result.documentInfo);

        // Notify other components that a document was uploaded
        window.dispatchEvent(new CustomEvent("document-uploaded"));

        // Start countdown for auto-navigation
        let timeLeft = 10; // Aumentamos a 10 segundos
        setCountdown(timeLeft);

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            router.push("/chat");
          }
        }, 1000);

        // Guardar el interval para poder cancelarlo
        (window as any).countdownInterval = countdownInterval;
      } else {
        setIsUploading(false);
        setUploadStatus("error");
        setError(result.error || "Error procesando el archivo");
      }
    } catch (err) {
      setIsUploading(false);
      setUploadStatus("error");
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError(
            "Error de conexión. Verifica tu conexión a internet e intenta de nuevo."
          );
        } else if (err.message.includes("HTTP error")) {
          setError("Error del servidor. Por favor intenta de nuevo más tarde.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError("Error inesperado. Por favor intenta de nuevo.");
      }
    }
  };

  const handleRetry = () => {
    setUploadStatus("idle");
    setIsUploading(false);
    setError(null);
    setProcessingInfo(null);
    setCountdown(10);
    setAutoRedirectCancelled(false);
  };

  const cancelAutoRedirect = () => {
    if ((window as any).countdownInterval) {
      clearInterval((window as any).countdownInterval);
    }
    setAutoRedirectCancelled(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mb-6">
            <svg
              className="w-8 h-8 text-white"
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
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Subir Documento PDF
          </h1>
          <p className="text-slate-600 text-lg">
            Sube tu documento para comenzar a hacer preguntas inteligentes
          </p>
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div
            {...getRootProps()}
            className={`p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive ? "bg-blue-50 border-blue-300" : "hover:bg-slate-50"
            } ${isUploading ? "pointer-events-none opacity-75" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-6">
              {isUploading ? (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors ${
                    isDragActive ? "bg-blue-100" : "bg-slate-100"
                  }`}
                >
                  <svg
                    className={`w-10 h-10 transition-colors ${
                      isDragActive ? "text-blue-600" : "text-slate-400"
                    }`}
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
              )}

              {isUploading ? (
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Procesando documento...
                  </h3>
                  <p className="text-slate-500">
                    Analizando y dividiendo el contenido en fragmentos para
                    optimizar las búsquedas
                  </p>
                </div>
              ) : isDragActive ? (
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    ¡Suelta el archivo aquí!
                  </h3>
                  <p className="text-blue-500">
                    Procesaremos tu documento PDF inmediatamente
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Arrastra tu archivo PDF aquí
                  </h3>
                  <p className="text-slate-500 mb-4">
                    O haz clic para seleccionar desde tu computadora
                  </p>
                  <div className="inline-flex items-center space-x-2 text-sm text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Máximo 10MB • Solo archivos PDF</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {file && !isUploading && (
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 mb-1">
                    Archivo seleccionado
                  </h4>
                  <p className="text-slate-600 truncate">{file.name}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center space-x-2"
              >
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Procesar Documento</span>
              </button>
            </div>
          )}
        </div>

        {/* Success State - Modal más prominente */}
        {uploadStatus === "success" && processingInfo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden max-w-lg w-full mx-4 animate-in zoom-in-95 duration-500">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Éxito!</h3>
                <p className="text-emerald-100">
                  Tu documento está listo para usar
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-600"
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
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 truncate">
                          {processingInfo.filename}
                        </p>
                        <p className="text-sm text-slate-600">
                          {processingInfo.chunks} fragmentos procesados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!autoRedirectCancelled && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="animate-pulse w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-800">
                            Redirigiendo automáticamente...
                          </span>
                          <p className="text-blue-600 text-sm">
                            En {countdown} segundo{countdown !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-bold">
                              {countdown}
                            </span>
                          </div>
                          <svg className="absolute inset-0 w-10 h-10 transform -rotate-90">
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-blue-300"
                            />
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={`${
                                (10 - countdown) * 10.05
                              } 100.53`}
                              className="text-blue-600 transition-all duration-1000 ease-linear"
                            />
                          </svg>
                        </div>
                        <button
                          onClick={cancelAutoRedirect}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Botón principal más prominente */}
                  <button
                    onClick={() => {
                      if ((window as any).countdownInterval) {
                        clearInterval((window as any).countdownInterval);
                      }
                      router.push("/chat");
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                  >
                    <svg
                      className="w-6 h-6"
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
                    <span>Comenzar a Chatear</span>
                    <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                      ¡Listo!
                    </div>
                  </button>

                  {/* Botón secundario */}
                  <button
                    onClick={() => {
                      if ((window as any).countdownInterval) {
                        clearInterval((window as any).countdownInterval);
                      }
                      setFile(null);
                      setUploadStatus("idle");
                      setIsUploading(false);
                      setProcessingInfo(null);
                      setError(null);
                      setCountdown(10);
                      setAutoRedirectCancelled(false);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Subir Otro Documento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8">
            <ErrorAlert
              title="Error al procesar el archivo"
              message={error}
              type="error"
              onRetry={handleRetry}
              onDismiss={() => setError(null)}
              retryText="Intentar de nuevo"
            />
          </div>
        )}
      </div>
    </div>
  );
}
