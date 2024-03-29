import PostalMime from "postal-mime";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

interface EmailMessage<Body = unknown> {
  readonly from: string;
  readonly to: string;
  readonly headers: Headers;
  readonly raw: ReadableStream;
  readonly rawSize: number;

  setReject(reason: String): void;
  forward(rcptTo: string, headers?: Headers): Promise<void>;
  reply(message: EmailMessage): Promise<void>;
}

/**
 * Convert's a readable stream into an array of bytes
 * Used to read the email's raw bocy into a suitable form for pasing
 * @param stream
 * @param streamSize
 * @returns
 */

async function streamToArrayBuffer(stream: ReadableStream, streamSize: number) {
  let result = new Uint8Array(streamSize);
  let bytesRead = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.set(value, bytesRead);
    bytesRead += value.length;
  }
  return result;
}

export default {
  /**
   * Default email function for the worker
   * Parses the email with {@link @PostalMime}
   * Sends the content's of the email through HTTP POST, secret used as "password"
   * POST request: `{ from, subject, text, html, secret }`
   * Forward the message onto another email address
   * Environmental variables: `API_URL, SECRET, FORWARD_EMAIL`
   * @param message
   * @param env environmental variables from Cloudflare
   * @param ctx
   */

  async email(message: EmailMessage, env: any, ctx: any) {
    const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
    const parser = new PostalMime();
    const parsedEmail = await parser.parse(rawEmail);
    await fetch(`${env.API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from,
        subject: message.headers.get("subject"),
        text: parsedEmail.text,
        html: parsedEmail.html,
        secret: env.SECRET,
      }),
    });
    await message.forward(env.FORWARD_EMAIL);
  },
};
