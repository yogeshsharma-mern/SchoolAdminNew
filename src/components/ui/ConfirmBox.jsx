import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmBox({ isOpen, title = "Are you sure?", message = "", onConfirm, onCancel, loading }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                >
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}

                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 text-white transition font-medium"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Confirm"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
