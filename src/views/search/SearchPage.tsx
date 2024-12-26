import { Input } from "@/components/ui/input";
import { RangePicker } from "@/components/range-picker";
import { useMediaQuery } from "usehooks-ts";
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
import { useSearchData } from "@/views/search/useSearchData";
import { Checkbox } from "@/components/ui/checkbox";

function SearchPage() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const { params, setParams, blogPosts } = useSearchData();

  return (
    <div className="flex flex-col h-full gap-5 xl:flex-row">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="search"
          value={params.q ?? ""}
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
        <div className="flex items-center gap-2 px-1">
          <Checkbox
            id="throw_error"
            checked={!!params.error}
            onCheckedChange={(v) =>
              setParams((prev) => ({ ...prev, error: v ? "true" : undefined }))
            }
          />
          <label
            htmlFor="throw_error"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Throw API Error
          </label>
        </div>
      </div>

      <div className="flex-grow min-h-1 min-w-1 overflow-auto">
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
  );
}

export default SearchPage;
