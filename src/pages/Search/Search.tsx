import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

// Function to fetch search results from Open Library API
const fetchSearchResults = async (
    q: string,
    page: number,
    limit: number
) => {
    const params = new URLSearchParams({
        q,
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
    });

    const response = await fetch(
        `https://openlibrary.org/search.json?${params.toString()}`
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

    const q = searchParams.get("q") || "";
    // bring page number from url
    const page = Number(searchParams.get("page") || 1);
    const limit = 18;

    const { data } = useQuery({
        queryKey: ['searchResults', q, page],
        queryFn: () => fetchSearchResults(q, page, limit),
        enabled: !!q, 
    });

    const books = data?.docs || [];
    // pagination
    const total = data?.numFound || 0;
    const totalPages = Math.ceil(total / limit);
    const pageWindow = 5;
    const startPage = Math.floor((page - 1) / pageWindow) * pageWindow + 1;
    const endPage = Math.min(startPage + pageWindow - 1, totalPages);
    
    const goToPage = (p: number) => {
        navigate(`/search?q=${encodeURIComponent(q)}&page=${p}`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2">
            🔍 Search results for <span className="text-blue-600">"{q}"</span>
        </h2>

        <p className="text-gray-500">{total} results found</p>

        {/* card list */}
        <ul
            style={{ listStyle: "none", paddingLeft: 0 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
            {books.map((book: any) => (
            <li
                key={book.key}
                className="bg-white rounded-xl shadow-sm p-3 border hover:shadow-md transition"
                onClick={() =>
                navigate(`/books/${book.key.replace("/works/", "")}`)
                }
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
                <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                <p className="text-lg text-gray-600 mb-2">
                {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
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
        {books.length > 0 && (
            <div className="flex gap-2 mt-8 justify-center items-center flex-wrap">
            <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                ◀ Prev
            </button>

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                <button
                key={p}
                onClick={() => goToPage(p)}
                style={{ fontWeight: p === page ? "bold" : "normal" }}
                >
                {p}
                </button>
            ))}

            <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next ▶
            </button>
            </div>
        )}
        </div>
    );
};
