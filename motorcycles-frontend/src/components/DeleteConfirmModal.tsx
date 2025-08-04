"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import DependencyAlertModal from "./DependencyAlertModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  loading?: boolean;
  checkDependencies?: () => Promise<{canDelete: boolean, message: string, dependencies: string[]}>;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
  checkDependencies,
}: DeleteConfirmModalProps) {
  const [showDependencyAlert, setShowDependencyAlert] = useState(false);
  const [dependencyData, setDependencyData] = useState<{
    message: string;
    dependencies: string[];
  }>({ message: "", dependencies: [] });
  const [checkingDependencies, setCheckingDependencies] = useState(false);

  const handleConfirm = async () => {
    if (checkDependencies) {
      setCheckingDependencies(true);
      try {
        const result = await checkDependencies();
        if (!result.canDelete) {
          setDependencyData({
            message: result.message,
            dependencies: result.dependencies
          });
          setShowDependencyAlert(true);
          return;
        }
      } catch (error) {
        console.error("Error checking dependencies:", error);
      } finally {
        setCheckingDependencies(false);
      }
    }
    onConfirm();
  };

  const handleClose = () => {
    setShowDependencyAlert(false);
    setDependencyData({ message: "", dependencies: [] });
    onClose();
  };
  return (
    <>
      <Modal
        isOpen={isOpen && !showDependencyAlert}
        onClose={handleClose}
        title={title}
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm leading-relaxed text-gray-700">
                {message}
              </p>
              {itemName && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    &ldquo;{itemName}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  <strong className="font-semibold">Advertencia:</strong> Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose}
              disabled={loading || checkingDependencies}
              className="order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="primary"
              onClick={handleConfirm}
              loading={loading || checkingDependencies}
              className="order-1 sm:order-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2"
            >
              {checkingDependencies ? "Verificando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </Modal>

      <DependencyAlertModal
        isOpen={showDependencyAlert}
        onClose={() => {
          setShowDependencyAlert(false);
          handleClose();
        }}
        title="No se puede eliminar"
        message={dependencyData.message}
        dependencies={dependencyData.dependencies}
        itemName={itemName}
      />
    </>
  );
}