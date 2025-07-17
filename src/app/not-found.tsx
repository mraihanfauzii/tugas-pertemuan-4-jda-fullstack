import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-9xl font-extrabold tracking-widest animate-pulse">404</h1>
      <div className="bg-white text-gray-800 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <button className="mt-5">
        <a
          className="relative inline-block text-sm font-medium text-blue-600 group active:text-blue-500 focus:outline-none focus:ring"
        >
          <span
            className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-white group-hover:translate-y-0 group-hover:translate-x-0"
          ></span>
          <span className="relative block px-8 py-3 bg-blue-600 border border-current text-white">
            <Link href="/">Go Home</Link>
          </span>
        </a>
      </button>
    </div>
  );
}