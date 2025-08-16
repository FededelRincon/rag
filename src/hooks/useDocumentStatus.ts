'use client';

import { useState, useEffect, useCallback } from 'react';

interface DocumentInfo {
    filename: string;
    chunks: number;
    uploadedAt: string;
}

interface StatusResponse {
    hasDocument: boolean;
    documentInfo?: DocumentInfo;
}

export function useDocumentStatus() {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/status');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: StatusResponse = await response.json();
            setStatus(result);
        } catch (err) {
            console.error('Error checking document status:', err);
            setError(err instanceof Error ? err.message : 'Error checking document status');
            setStatus({ hasDocument: false });
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshStatus = useCallback(() => {
        checkStatus();
    }, [checkStatus]);

    const clearDocumentStatus = useCallback(() => {
        setStatus({ hasDocument: false });
    }, []);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    return {
        status,
        loading,
        error,
        refreshStatus,
        clearDocumentStatus,
        hasDocument: status?.hasDocument || false,
        documentInfo: status?.documentInfo
    };
}