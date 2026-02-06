import { useEffect, useState, type SyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from "react-router-dom";



// Function to fetch advanced search results from Open Library API
const fetchAdvancedSearch = async (
    params: Record<string, string>,
    page: number,
    limit: number
) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value.trim()) {
            queryParams.append(key, value);
        }
    });
    
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", ((page - 1) * limit).toString());


    const response = await fetch(
        `https://openlibrary.org/search.json?${queryParams.toString()}`
    );
    
    if (!response.ok) {
        throw new Error("Failed to fetch advanced search results");
    }
    
    return response.json();
}; 


// Advanced Search Page Component
export const AdvancedSearchPage = () => {

    const navigate = useNavigate();

    // pagination
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const [limit] = useState(18);

    useEffect(() => {
        const hasParams = Array.from(searchParams.keys()).length > 0;

        if (hasParams) {
            setSubmittedFilters({
            title: searchParams.get("title") || "",
            author: searchParams.get("author") || "",
            first_publish_year: searchParams.get("first_publish_year") || "",
            subject: searchParams.get("subject") || "",
            });
        }
    }, []);


    const [filters, setFilters] = useState({
        title: searchParams.get("title") || "",
        author: searchParams.get("author") || "",
        first_publish_year: searchParams.get("first_publish_year") || "",
        subject: searchParams.get("subject") || "",
    });

    const [submittedFilters, setSubmittedFilters] = useState<Record<string, string> | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['advancedSearch', submittedFilters, page],
        queryFn: () => fetchAdvancedSearch(submittedFilters!, page, limit),
        enabled: !!submittedFilters, // Only run query when filters are submitted
    });

    const books = data?.docs || [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // push search button
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                queryParams.append(key, value);
        }
        });

        queryParams.set("page", "1");

        navigate(`/advanced-search?${queryParams.toString()}`);
        setSubmittedFilters({...filters});
    };

    const goToPage = (nextPage: number) => {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set("page", nextPage.toString());

        navigate(`/advanced-search?${queryParams.toString()}`);
    };

    // pagination
    const total = data?.numFound || 0;
    const totalPages = Math.ceil(total / limit);

    const pageWindow = 5;
    const startPage =
    Math.floor((page - 1) / pageWindow) * pageWindow + 1;
    const endPage = Math.min(startPage + pageWindow - 1, totalPages);


    
    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold">🔎 Advanced Book Search</h2>

        {/* Search Form */}
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 mt-8 mb-8"
        >
            <input
            name="title"
            placeholder="Title"
            value={filters.title}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            />

            <input
            name="author"
            placeholder="Author"
            value={filters.author}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            />

            <input
            name="first_publish_year"
            placeholder="Year"
            value={filters.first_publish_year}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            />

            <input
            name="subject"
            placeholder="Subject"
            value={filters.subject}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            />

            <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
            Search
            </button>
        </form>

        {/* Results */}
        {isLoading && <p>Searching…</p>}
        {error && <p>Error loading results</p>}

        {/* no result message */}
        {!isLoading && submittedFilters !== null && books.length === 0 && (
            <div className="mt-12 text-center text-black-500">
                <p className="text-2xl font-medium">No result</p>
                <p className="mt-2 text-sm">Try again with other kewords !</p>
            </div>
        )}
        
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

        {/* pagination */}
        {submittedFilters && !isLoading && totalPages > 1 && ( 
        <div className="flex gap-2 mt-8 justify-center items-center flex-wrap">
            <button
                disabled={page === 1}
                onClick={() => goToPage(page-1)}
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
                ◀ Prev
            </button>

            {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            ).map((p) => (
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
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
                Next ▶
            </button>
        </div>
        )}
    </div>
    );
}