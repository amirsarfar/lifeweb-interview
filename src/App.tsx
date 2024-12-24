import { Input } from "@/components/ui/input";
import "./App.css";
import { RangePicker } from "@/components/range-picker";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useNavigate, useSearchParams } from "react-router";
import { useDebounceCallback } from "usehooks-ts";
import qs from "qs";
import { format } from "date-fns";

type TPost = {
  title: string;
  id: string;
  lead: string;
  published_at: string;
  content: string;
  news_agency_name: string;
  url: string;
};

function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const [filters, setFilters] = useState<{
    q: string;
    dateRange: DateRange;
  }>({
    q,
    dateRange: {
      from: fromDate ? new Date(fromDate) : new Date(),
      to: toDate ? new Date(toDate) : new Date(),
    },
  });

  const [blogPosts, setBlogPosts] = useState<TPost[]>([]);

  const updateUrl = useDebounceCallback(
    useCallback(
      (p) => {
        navigate(`/?${qs.stringify(p)}`);
      },
      [navigate]
    ),
    500
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const data = await (
        await fetch(
          `http://localhost:3000/api/blog_posts?${qs.stringify({
            q,
            toDate,
            fromDate,
          })}`,
          { signal }
        )
      ).json();
      setBlogPosts(data);
    })();

    return () =>
      controller.abort("Filter has changed before request completion");
  }, [fromDate, q, toDate]);

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="search"
            value={filters.q}
            onChange={(e) => {
              setFilters((p) => ({ ...p, q: e.target.value }));
              updateUrl({ fromDate, toDate, q: e.target.value });
            }}
          ></Input>
          <RangePicker
            date={filters.dateRange}
            setDate={(v) => {
              setFilters((p) => ({ ...p, dateRange: v }));
              updateUrl({
                q,
                ...(v.from ? { fromDate: format(v.from, "yyyy-MM-dd") } : {}),
                ...(v.to ? { toDate: format(v.to, "yyyy-MM-dd") } : {}),
              });
            }}
          ></RangePicker>
        </div>

        <div>
          {blogPosts.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
