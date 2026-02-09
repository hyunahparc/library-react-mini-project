import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

// Function to fetch book detail from Open Library API
const fetchBookDetail = async (bookId: string) => {
    const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
    if(!response.ok) {
        throw new Error("Failed to fetch book detail");
    }
    return response.json();
}

const fetchAuthor = async (authorId: string) => {
    const response = await fetch(`https://openlibrary.org${authorId}.json`);
    if(!response.ok) {
        throw new Error("Failed to fetch author detail");
    }
    return response.json();
}

const fetchWikipediaSummary = async (title: string) => {
    const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
        )}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Wikipedia summary");
    }

    return response.json();
};

// Book Detail Page Component
export const BookDetailPage = () => {
    const { bookId } = useParams<{ bookId: string }>();

    // Use React Query to fetch book detail
    const { data: bookData, isLoading, error } = useQuery({
        queryKey: ["bookDetail", bookId],
        queryFn: () => fetchBookDetail(bookId!),
        enabled: !!bookId,
    });

    const authorKey = bookData?.authors?.[0]?.author?.key;
    
    const { data: authorData } = useQuery({
        queryKey: ["authorDetail", authorKey],
        queryFn: () => fetchAuthor(authorKey!),
        enabled: !!authorKey,
    });

    // Open Library description (string | { value })
    const openLibraryDescription =
        typeof bookData?.description === "string"
        ? bookData.description
        : bookData?.description?.value;

    const shouldUseWikipedia =
        !openLibraryDescription ||
        openLibraryDescription.length < 200;

    // Wikipedia query (fallback)
    const { data: wikiData } = useQuery({
        queryKey: ["wikiSummary", bookData?.title],
        queryFn: () => fetchWikipediaSummary(bookData.title),
        enabled: !!bookData?.title && shouldUseWikipedia,
    });

    if (isLoading) return <p>Loading book detail…</p>;
    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
                Sorry, the book you are looking for does not exist.
            </p>
            <a
                href="/"
                className="px-4 py-2 transition"
            >
                Back to Home
            </a>
        </div>
    );

    const finalDescription = shouldUseWikipedia
    ? wikiData?.extract
    : openLibraryDescription;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* title */}
            <h2 className="text-3xl font-semibold mb-4">{bookData.title}</h2>
            {/* author */}
            <p className="text-xl text-gray-600 mb-4">
                by {authorData?.name || "Unknown Author"}
            </p>
            {/* cover image */}
            {bookData.covers ? (
                <img src={`https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`} 
                alt="Book Cover" 
                className="w-50 max-w-50 mx-auto" 
                />
            ) : (
                <img src="https://openlibrary.org/images/icons/avatar_book-sm.png" 
                alt="No Cover Available" 
                className="w-50 max-w-50 mx-auto" />
            )}
            {/* description */}
            {finalDescription && (
                <div className="mt-4 text-gray-700 leading-relaxed">
                <ReactMarkdown>
                    {finalDescription}
                </ReactMarkdown>

                <p className="mt-2 text-sm text-gray-400">
                    Source:{" "}
                    {shouldUseWikipedia ? "Wikipedia" : "Open Library"}
                </p>

                {shouldUseWikipedia && wikiData?.content_urls?.desktop?.page && (
                    <a
                    href={wikiData.content_urls.desktop.page}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                    >
                    Read more on Wikipedia →
                    </a>
                )}
                </div>
            )}

            {/* subjects */}
            {bookData.subjects && (
            <div className="mt-10">
                <h3 className="font-semibold mb-4">Subjects</h3>
                <ul className="flex flex-wrap gap-2 items-center justify-center">
                    {bookData.subjects.slice(0, 10).map((subject: string) => (
                        <li
                        key={subject}
                        className="px-3 py-1 text-sm rounded-full bg-gray-50 text-black-700"
                        >
                        {subject}
                        </li>
                    ))}
                </ul>
            </div>
         )}
        </div>
    );
}
