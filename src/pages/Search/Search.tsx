import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const fetchSearchResults = async (query: string) => {
    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch search results");
    }
    return response.json();
};

export const SearchPage = () => {

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data, isLoading, error } = useQuery({
        queryKey: ['searchResults', query],
        queryFn: () => fetchSearchResults(query),
        enabled: !!query,
    });

      if (!query) {
    return <p>Please enter a search keyword.</p>;
  }

    if (isLoading) return <p>Searching books…</p>;
    if (error) return <p>Error loading search results.</p>;

    const books = data?.docs || [];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>🔍 Search results for "<strong>{query}</strong>"</h2>

        <p style={{ color: "#666", marginBottom: "16px" }}>
            {books.length} results found
        </p>

        <ul style={{ listStyle: "none", padding: 0 }}>
            {books.map((book: any) => (
                <li 
                    key={book.key} 
                    style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                    }}>
                    <strong>{book.title}</strong> by {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                </li>
            ))}
        </ul>
    </div>
  );
}