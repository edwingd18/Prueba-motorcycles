"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { motorcyclesApi } from "@/services/api";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await motorcyclesApi.getAll();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    checkConnection();
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted || isConnected === null) {
    return null; // No mostrar nada mientras se verifica inicialmente
  }

  if (isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Conectado al servidor</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Sin conexión al servidor
          </h3>
          <p className="text-sm text-red-600 mt-1">
            No se puede conectar al backend en el puerto 8080. Asegúrate de que
            el servidor esté ejecutándose.
          </p>
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium flex items-center space-x-1"
          >
            {isChecking ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <Wifi className="h-3 w-3" />
                <span>Reintentar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
