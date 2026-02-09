import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchTrendingBooks = async (limit: number) => {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=bestseller&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending books");
  }

  return response.json();
};

export const TrendingBooksCarousel = () => {
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingBooks", limit],
    queryFn: () => fetchTrendingBooks(limit),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  const books = data?.docs ?? [];

  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-4">
        🔥 Trending Books
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {books.map((book: any) => {
          const workId = book.key?.replace("/works/", "");

          return (
            <div
              key={book.key}
              className="min-w-[160px] bg-white rounded-lg shadow-sm p-3 border hover:shadow-md transition"
            >
              <Link to={`/books/${workId}`}>
                <div className="h-40 flex items-center justify-center mb-3">
                  <img
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "https://openlibrary.org/images/icons/avatar_book-sm.png"
                    }
                    alt={book.title}
                    className="h-full object-contain"
                  />
                </div>
              </Link>

              <p className="text-sm font-medium line-clamp-2">
                {book.title}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {book.author_name?.[0] || "Unknown author"}
              </p>

              {workId && (
                <Link
                  to={`/books/${workId}`}
                  className="block mt-2 text-sm text-blue-600 hover:underline"
                >
                  View details →
                </Link>
              )}
            </div>
            
          );
        })}
      </div>
    </section>
  );
};
