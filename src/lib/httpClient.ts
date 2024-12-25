const requestToServer = async ({
  endpoint,
  headers,
  method,
  payload,
  signal,
}: {
  endpoint: string;
  method: string;
  headers?: { [k: string]: string | number | boolean };
  payload?: object;
  signal?: AbortController["signal"];
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
    {
      method,
      signal,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        ...headers,
      },
      ...(payload
        ? {
            body:
              payload instanceof FormData ? payload : JSON.stringify(payload),
          }
        : {}),
    }
  );
  return response;
};

const get = ({
  endpoint,
  headers,
  signal,
}: {
  endpoint: string;
  headers?: { [k: string]: string | number | boolean };
  signal?: AbortController["signal"];
}) => {
  return requestToServer({ endpoint, headers, method: "GET", signal });
};

const post = ({
  endpoint,
  headers,
  payload,
  signal,
}: {
  endpoint: string;
  headers?: { [k: string]: string | number | boolean };
  payload?: object;
  signal?: AbortController["signal"];
}) => {
  return requestToServer({
    endpoint,
    headers,
    method: "POST",
    payload,
    signal,
  });
};

const put = ({
  endpoint,
  headers,
  payload,
  signal,
}: {
  endpoint: string;
  headers?: { [k: string]: string | number | boolean };
  payload?: object;
  signal?: AbortController["signal"];
}) => {
  return requestToServer({ endpoint, headers, method: "PUT", payload, signal });
};

const httpClient = {
  get,
  post,
  put,
};

export default httpClient;

export class CancelError {
  message: string = "";
  constructor(message: string) {
    this.message = message;
  }
}
