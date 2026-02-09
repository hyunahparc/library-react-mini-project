export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="px-4 py-2 transition"
      >
        Back to Home
      </a>
    </div>
  );
};
