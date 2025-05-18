import React from 'react';

const ChatPlaceholder = () => {
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1607082350899-ffa6dd2b0c03?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0  backdrop-blur-sm" />
      <h1
        className="absolute text-[120px] md:text-[160px] font-black  opacity-20 select-none animate-echo-float z-0"
        style={{
          animation: 'echo-float 4s ease-in-out infinite',
        }}
      >
        ECHO
      </h1>
      <div className="z-10 text-center">
        <h2 className="text-2xl font-semibold">Select a conversation to chat</h2>
        <p className="text-sm mt-2">Your messages will appear here</p>
      </div>
      <style>{`
        @keyframes echo-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) scale(1.05);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPlaceholder;
