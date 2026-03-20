import React from "react";

const SpinnerLoader = ({ 
  size = 40, 
  color = "#3B82F6",
  text = "Loading...",
  thickness = 3,
  speed = 0.8
}) => {
  return (
    <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
      <div
        className="rounded-full animate-spin"
        style={{
          width: size,
          height: size,
          border: `${thickness}px solid ${color}20`,
          borderTopColor: color,
          animation: `spin ${speed}s linear infinite`
        }}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpinnerLoader;