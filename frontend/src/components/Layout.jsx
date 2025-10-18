import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-[50%] top-0 -z-10 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,255,0.2),rgba(0,0,0,0))]"></div>
        </div>
        <main className="flex flex-col items-center justify-center p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;