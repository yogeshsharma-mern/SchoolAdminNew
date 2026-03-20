export default function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 overflow-y-scroll bg-black/30 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[var(--color-neutral)]  rounded-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          className="absolute cursor-pointer top-3 cursor-pointer right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
