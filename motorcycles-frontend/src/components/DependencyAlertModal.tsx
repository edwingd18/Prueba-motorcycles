"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface DependencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  dependencies: string[];
  itemName?: string;
}

export default function DependencyAlertModal({
  isOpen,
  onClose,
  title,
  message,
  dependencies,
  itemName,
}: DependencyAlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
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

        {dependencies.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <ExternalLink className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="text-sm font-semibold text-orange-800">
                Dependencias encontradas:
              </h4>
            </div>
            <ul className="space-y-2">
              {dependencies.map((dependency, index) => (
                <li key={index} className="flex items-center text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                  {dependency}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong className="font-semibold">Sugerencia:</strong> Para eliminar este registro, 
                primero debe eliminar o modificar las dependencias listadas arriba.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button 
            type="button" 
            variant="primary" 
            onClick={onClose}
            className="px-8"
          >
            Entendido
          </Button>
        </div>
      </div>
    </Modal>
  );
}