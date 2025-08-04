"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl", 
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-[95vw]"
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4 lg:p-6">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-white/95 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={cn(
            "relative bg-white rounded-xl shadow-2xl w-full max-h-[95vh] overflow-hidden mx-2 sm:mx-4",
            "transform transition-all duration-300 ease-out",
            "animate-in fade-in-0 zoom-in-95",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-4">
              {title}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="flex-shrink-0 hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
            <div className="p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
