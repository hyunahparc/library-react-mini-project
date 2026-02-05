import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

// Function to fetch search results from Open Library API
const fetchSearchResults = async (
    query: string,
    page: number,
    limit: number
) => {
    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch search results");
    }
    return response.json();
};

// Search Page Component
export const SearchPage = () => {
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(18);

    // Use React Query to fetch search results
    const { data, isLoading, error } = useQuery({
        queryKey: ['searchResults', query, page],
        queryFn: () => fetchSearchResults(query, page, limit),
        enabled: !!query,
    });

    if (!query) {
         return <p>Please enter a search keyword.</p>;
    }

    if (isLoading) return <p>Searching books…</p>;
    if (error) return <p>Error loading search results.</p>;

    // Extract books from the fetched data
    const books = data?.docs || [];

    // Calculate total pages for pagination
    const total = data.numFound;
    const totalPages = Math.ceil(total / limit);
    const pageWindow = 5;
    const startPage = Math.floor((page - 1) / pageWindow) * pageWindow + 1;
    const endPage = Math.min(startPage + pageWindow - 1, totalPages);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-2">
                🔍 Search results for <span className="text-blue-600">"{query}"</span>
            </h2>

            <p className="text-gray-500">
                {total} results found
            </p>

            {/* card list */}
            <ul style={{ listStyle: "none", paddingLeft: 0 }} 
            className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
            ">
                {books.map((book: any) => (
                    <li
                        key={book.key}
                        className="
                        bg-white
                        rounded-xl
                        shadow-sm
                        p-3
                        border
                        hover:shadow-md
                        transition
                        "
                        onClick={() => navigate(`/books/${book.key.replace("/works/", "")}`)}
                    >
                    <div className="w-38 h-65 mb-4 mx-auto flex items-center justify-center">
                        <img
                        src={
                            book.cover_i
                            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                            : "https://openlibrary.org/images/icons/avatar_book-sm.png"
                        }
                        alt={book.title}
                        className="w-full h-auto rounded"
                        />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                    {book.title}
                    </h3>

                    <p className="text-lg text-gray-600 mb-2">
                    {book.author_name
                        ? book.author_name.join(", ")
                        : "Unknown Author"}
                    </p>

                    {book.first_publish_year && (
                    <p className="text-sm text-gray-400">
                        First published: {book.first_publish_year}
                    </p>
                    )}
                </li>
                ))}
            </ul>
            {/* Pagination Controls */}
            <div className="flex gap-2 mt-8 justify-center items-center flex-wrap">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    ◀ Prev
                </button>

                {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, i) => startPage + i
                ).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                        fontWeight: p === page ? "bold" : "normal",
                        }}
                    >
                        {p}
                    </button>
                ))}

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
}

