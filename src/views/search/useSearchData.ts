import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import qs, { ParsedQs } from "qs";
import { useDebounceCallback } from "usehooks-ts";
import httpClient, { CancelError } from "@/lib/httpClient";
import { useToast } from "@/hooks/use-toast";

type TPost = {
  title: string;
  id: string;
  lead: string;
  published_at: string;
  content: string;
  news_agency_name: string;
  url: string;
};

interface TFilters extends ParsedQs {
  q?: string;
  fromDate?: string;
  toDate?: string;
  error?: string;
}

const useSearchUrlState = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlData: TFilters = useMemo(() => qs.parse(search.slice(1)), [search]);

  const [state, setState] = useState<TFilters>(() => urlData);

  const updateUrl = useDebounceCallback(
    useCallback(
      (p) => {
        navigate(`${window.location.pathname}?${qs.stringify(p)}`);
      },
      [navigate]
    ),
    500
  );

  const setUrlState = useCallback(
    (p: (prev: TFilters) => TFilters) => {
      setState(p);
      updateUrl(p(qs.parse(window.location.search.slice(1))));
    },
    [updateUrl]
  );

  useEffect(() => {
    setState(qs.parse(search.slice(1)));
  }, [search]);

  return { params: state, deferredParams: urlData, setParams: setUrlState };
};

export const useSearchData = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<TPost[]>([]);

  const { params, deferredParams, setParams } = useSearchUrlState();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handleError = () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in our server.",
      });
      setBlogPosts([]);
    };

    (async () => {
      try {
        const postsRes = await httpClient.get({
          endpoint: `api/blog_posts?${qs.stringify(deferredParams)}`,
          signal,
        });
        if (postsRes.ok) {
          const data = await postsRes.json();
          setBlogPosts(data);
        } else {
          handleError();
        }
      } catch (e) {
        if (!(e instanceof CancelError)) handleError();
      }
    })();

    return () =>
      controller.abort(
        new CancelError("Filter has changed before request completion")
      );
  }, [deferredParams, toast]);

  return { params, setParams, blogPosts };
};
