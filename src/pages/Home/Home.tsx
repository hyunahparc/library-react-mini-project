import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchRecentChanges = async (limit: number) => {
  const response = await fetch(
    `http://openlibrary.org/recentchanges.json?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent changes");
  }

  return response.json();
}

const getReadableType = (kind: string) => {
  switch (kind) {
    case "edit-book":
      return "📘 Book updated";
    case "add-book":
      return "📗 New book added";
    case "edit-author":
      return "👤 Author updated";
    default:
      return "🔧 Document updated";
  }
};


export const HomePage = () => {
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['recentChanges', limit],
    queryFn: () => fetchRecentChanges(limit),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading library data</div>;

  const getDocumentKey = (change: any): string | null => {
    return (
      change.data?.key ||
      change.changes?.[0]?.key ||
      null
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>📚 Recent Library Updates</h2>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Latest document changes from Open Library
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.map((change: any) => {
          const date = new Date(change.timestamp).toLocaleString();
          const label = getReadableType(change.kind);
          const key = getDocumentKey(change)?.split("/").pop();

          return (
            <li key={change.id}>
              <strong>{label}</strong>
              <div>Updated book id: {key || "Unknown"}</div>
              <small>{date}</small><br />
              {key && <Link to={`https://openlibrary.org/book/${key}`}>View details</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  
  );
};




