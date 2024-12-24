import { Input } from "@/components/ui/input";
import "./App.css";
import { RangePicker } from "@/components/range-picker";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

function App() {
  const [filters, setFilters] = useState<{
    search: string;
    dateRange: DateRange;
  }>({ search: "", dateRange: { from: new Date() } });

  const [blogPosts, setBlogPosts] = useState<
    {
      title: string;
      id: string;
      lead: string;
      published_at: string;
      content: string;
      news_agency_name: string;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const data = await (
        await fetch("http://localhost:3000/api/blog_posts")
      ).json();
      setBlogPosts(data);
    })();
  }, []);

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4">
          <Input placeholder="search"></Input>
          <RangePicker
            date={filters.dateRange}
            setDate={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
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
