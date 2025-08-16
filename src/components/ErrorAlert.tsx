"use client";

interface ErrorAlertProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  onRetry?: () => void;
  onDismiss?: () => void;
  retryText?: string;
}

export default function ErrorAlert({
  title,
  message,
  type = "error",
  onRetry,
  onDismiss,
  retryText = "Reintentar",
}: ErrorAlertProps) {
  const styles = {
    error: {
      container: "bg-red-50 border border-red-200",
      title: "text-red-800",
      message: "text-red-700",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      container: "bg-yellow-50 border border-yellow-200",
      title: "text-yellow-800",
      message: "text-yellow-700",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      container: "bg-blue-50 border border-blue-200",
      title: "text-blue-800",
      message: "text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentStyles = styles[type];

  return (
    <div className={`rounded-lg p-4 ${currentStyles.container}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold mb-2 ${currentStyles.title}`}>
              {title}
            </h3>
          )}
          <p className={currentStyles.message}>{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}
      </div>

      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${currentStyles.button}`}
          >
            {retryText}
          </button>
        </div>
      )}
    </div>
  );
}
