"use client";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import BookingsContent from "./bookings-content";

interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingsModal({ isOpen, onClose }: BookingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="font-semibold text-lg">Bookings</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <BookingsContent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
