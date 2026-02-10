import { useQuery } from "@tanstack/react-query";

const fetchRecentChanges = async (limit: number) => {
  const res = await fetch(
    `https://openlibrary.org/recentchanges.json?limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch recent updates");
  }
  return res.json();
};

const getReadableType = (kind: string) => {
  switch (kind) {
    case "add-book":
      return "🆕 New book added";
    case "edit-book":
      return "✏️ Book updated";
    case "edit-author":
      return "👤 Author updated";
    default:
      return "📄 Document updated";
  }
};

const getDocumentKey = (change: any): string | null => {
  return (
    change.data?.key ||
    change.changes?.[0]?.key ||
    null
  );
};

export const RecentUpdatesCarousel = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recentUpdates"],
    queryFn: () => fetchRecentChanges(15),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading updates</div>;

  return (
    <section className="mt-10 max-w-[1200px] mx-auto">
      <h3 className="text-xl font-semibold mb-4">
        📚 Recent Library Updates
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.map((change: any) => {
          const key = getDocumentKey(change)?.split("/").pop();
          const date = new Date(change.timestamp).toLocaleDateString();
          const label = getReadableType(change.kind);

          return (
            <div
              key={change.id}
              className="min-w-[160px] bg-white rounded-lg shadow-sm p-3 border hover:shadow-md transition flex flex-col justify-center"
            >
              <p className="text-sm font-semibold mb-1">{label}</p>

              <p className="text-sm text-gray-700 break-all">
                {key || "Unknown document"}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {date}
              </p>

            </div>
          );
        })}
      </div>
    </section>
  );
};
