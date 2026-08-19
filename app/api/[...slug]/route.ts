import { NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api/v1";
const BFF_TIMEOUT_MS = 60_000;
const LONG_BFF_TIMEOUT_MS = 180_000;
const LONG_TIMEOUT_PREFIXES = ["apply", "cv"];

export const maxDuration = 180;

function buildTargetUrl(slug: string[], request: NextRequest): string {
  const path = slug.join("/");
  const url = new URL(request.url);
  return `${API_BASE_URL}/${path}${url.search}`;
}

function buildRequestHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Forwarded-Proto": "https",
  };

  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const cookie = request.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;

  const accept = request.headers.get("accept");
  if (accept) headers["Accept"] = accept;

  return headers;
}

function buildResponseHeaders(backendResponse: Response): Headers {
  const headers = new Headers();

  const contentType = backendResponse.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const cookies = getSetCookieHeaders(backendResponse);
  for (const cookie of cookies) {
    headers.append("set-cookie", cookie);
  }

  const cacheControl = backendResponse.headers.get("cache-control");
  if (cacheControl) headers.set("cache-control", cacheControl);

  headers.set("vary", "Cookie");

  return headers;
}

function getSetCookieHeaders(response: Response): string[] {
  const cookies: string[] = [];
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }
  response.headers.forEach((value, name) => {
    if (name.toLowerCase() === "set-cookie") {
      cookies.push(value);
    }
  });
  return cookies;
}

async function proxy(request: NextRequest, slug: string[]): Promise<Response> {
  const targetUrl = buildTargetUrl(slug, request);
  const method = request.method;

  const fetchOptions: RequestInit = {
    method,
    headers: buildRequestHeaders(request),
  };

  if (method !== "GET" && method !== "HEAD") {
    fetchOptions.body = await request.arrayBuffer();
  }

  const longTimeout = slug.length > 0 && LONG_TIMEOUT_PREFIXES.includes(slug[0]);
  const timeoutMs = longTimeout ? LONG_BFF_TIMEOUT_MS : BFF_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  fetchOptions.signal = controller.signal;

  try {
    const backendResponse = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);

    const responseBody = await backendResponse.arrayBuffer();
    const responseHeaders = buildResponseHeaders(backendResponse);

    return new Response(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("BFF proxy error:", method, targetUrl, error);
    return new Response(
      JSON.stringify({ detail: "Backend service unavailable" }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxy(request, params.slug);
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxy(request, params.slug);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxy(request, params.slug);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxy(request, params.slug);
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxy(request, params.slug);
}
