import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const AUTHORS = [
  "Émile Zola",
  "Marcel Proust",
  "Stendhal",
  "Victor Hugo",
  "Gustave Flaubert",
];

const fetchFrenchClassicBooks = async () => {
  const requests = AUTHORS.map((author) =>
    fetch(
      `https://openlibrary.org/search.json?author=${encodeURIComponent(
        author
      )}&limit=3`
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch french classics");
      return res.json();
    })
  );

  const results = await Promise.all(requests);

  // docs만 하나의 배열로 합침
  return results.flatMap((r) => r.docs);
};

export const FrenchBooksCarousel = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["frenchClassicBooks"],
    queryFn: fetchFrenchClassicBooks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  const books = data ?? [];

  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-4">
        🥐 French Classic Literature
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {books.map((book: any) => {
          const workId = book.key?.replace("/works/", "");

          return (
            <div
              key={`${book.key}-${book.cover_i}`}
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
