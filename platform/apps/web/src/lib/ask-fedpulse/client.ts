import {
  askFedPulseRequestSchema,
  parseAskFedPulseResponse,
  type AskFedPulseRequest,
  type AskFedPulseResponse,
} from "@/lib/ask-fedpulse/contract";

export class AskFedPulseApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AskFedPulseApiError";
    this.status = status;
  }
}

export interface ExecuteAskFedPulseOptions {
  accessToken?: string | null;
  signal?: AbortSignal;
  apiBaseUrl?: string;
}

function resolveApiBaseUrl(override?: string): string {
  const value =
    override ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";
  return value.replace(/\/$/, "");
}

export async function executeAskFedPulse(
  input: AskFedPulseRequest,
  options: ExecuteAskFedPulseOptions = {},
): Promise<AskFedPulseResponse> {
  const request = askFedPulseRequestSchema.parse(input);
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });
  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const response = await fetch(
    `${resolveApiBaseUrl(options.apiBaseUrl)}/api/v1/ask-fedpulse`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      signal: options.signal,
      cache: "no-store",
    },
  );

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new AskFedPulseApiError(
      "Ask FedPulse returned a non-JSON response.",
      response.status,
    );
  }

  if (!response.ok) {
    const detail =
      body && typeof body === "object" && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : `Ask FedPulse request failed with status ${response.status}.`;
    throw new AskFedPulseApiError(detail, response.status);
  }

  return parseAskFedPulseResponse(body);
}
