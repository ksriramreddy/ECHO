import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Repeating Skeleton Bubbles */}
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className={`w-fit max-w-[70%] px-4 py-2 rounded-lg shadow-md ${
            i % 2 === 0 ? "ml-auto bg-blue-200" : "mr-auto bg-gray-300"
          } relative overflow-hidden`}
        >
          <div className="w-60 h-6 bg-gray-200 rounded shimmer" />
        </div>
      ))}

      {/* Shimmer Keyframes */}
      <style>{`
        .shimmer {
          position: relative;
          background-color: #e0e0e0;
          overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatSkeleton;
