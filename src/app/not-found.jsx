"use client";
import React from 'react';
import Link from 'next/link';
const Notfound = () => {
    return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[rgb(255,38,0)] to-[#ff0000] text-white px-6">
      
      <h1 className="text-7xl md:text-9xl font-extrabold mb-4">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-center">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-300 text-center max-w-md mb-8">
        The page you are looking for might have been removed,
        had its name changed, or is temporarily unavailable.
      </p>

      <Link href="/">
        <button className="bg-[#52b788] hover:bg-[#40916c] transition px-6 py-3 rounded-xl font-medium shadow-lg">
          Go Back Home
        </button>
      </Link>

    </div>
    );
};

export default Notfound;