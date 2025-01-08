import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex items-center h-screen p-16 bg-primaryBg text-primary">
      <div className="container mx-auto text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-6xl font-bold text-red-600">404</h1>
          <h2 className="text-2xl md:text-4xl font-bold mt-4">Oops! Page Not Found</h2>
          <p className="mt-4 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <button className="px-6 py-3 text-lg font-medium text-primaryWhite bg-highlight rounded hover:bg-highlightHover">
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
