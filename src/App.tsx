import { Input } from "@/components/ui/input";
import "./App.css";
import { RangePicker } from "@/components/range-picker";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import qs from "qs";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUrlState } from "@/use-url-state";

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
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const [blogPosts, setBlogPosts] = useState<TPost[]>([]);

  const { params, deferredParams, setParams } = useUrlState();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const postsRes = await fetch(
        `http://localhost:3000/api/blog_posts?${qs.stringify(deferredParams)}`,
        { signal }
      );
      if (postsRes.ok) {
        const data = await postsRes.json();
        setBlogPosts(data);
      }
    })();

    return () =>
      controller.abort("Filter has changed before request completion");
  }, [deferredParams]);

  return (
    <div className="w-screen h-screen p-4 flex justify-center">
      <div className="flex flex-col gap-4 w-full h-full xl:flex-row max-w-screen-xl">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="search"
            value={params.q}
            onChange={(e) => {
              setParams((prev) => ({ ...prev, q: e.target.value }));
            }}
          ></Input>
          <RangePicker
            date={{
              from: params.fromDate ? new Date(params.fromDate) : new Date(),
              to: params.toDate ? new Date(params.toDate) : new Date(),
            }}
            setDate={(v) => {
              setParams((prev) => ({
                ...prev,
                ...(v.from ? { fromDate: format(v.from, "yyyy-MM-dd") } : {}),
                ...(v.to ? { toDate: format(v.to, "yyyy-MM-dd") } : {}),
              }));
            }}
          ></RangePicker>
        </div>

        <div className="max-h-screen flex-grow min-w-1 overflow-auto">
          {isDesktop ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Title</TableHead>
                  <TableHead className="w-[100px]">Channel</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="w-[150px] text-right">
                    Publish Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium line-clamp-3">
                      {post.title}
                    </TableCell>
                    <TableCell>{post.news_agency_name}</TableCell>
                    <TableCell>
                      <div
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      ></div>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(post.published_at), "dd MMMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col gap-4">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>
                      <div className="line-clamp-1">{post.title}</div>
                    </CardTitle>
                    <CardDescription>{post.news_agency_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>
                  </CardContent>
                  <CardFooter>
                    <p>{format(new Date(post.published_at), "dd MMMM yyyy")}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
