'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DialogProps {
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Composant Dialog pour les modales
 */
export function Dialog({ children }: DialogProps) {
  return <>{children}</>;
}

/**
 * Contenu principal du dialog
 */
export function DialogContent({ children, className = '', onClose }: DialogContentProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * En-tête du dialog
 */
export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return (
    <div className={`p-6 pb-4 border-b ${className}`}>
      {children}
    </div>
  );
}

/**
 * Titre du dialog
 */
export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

/**
 * Description du dialog
 */
export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Pied de page du dialog
 */
export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`p-6 pt-4 border-t bg-gray-50 flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Déclencheur du dialog
 */
export function DialogTrigger({ children, onClick }: DialogTriggerProps) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  );
}
