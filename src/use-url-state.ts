import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import qs, { ParsedQs } from "qs";
import { useDebounceCallback } from "usehooks-ts";

interface TFilters extends ParsedQs {
  q?: string;
  fromDate?: string;
  toDate?: string;
}

export const useUrlState = () => {
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
