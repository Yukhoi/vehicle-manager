import type { IncomingMessage } from "node:http";
import { PayloadTooLargeError } from "../errors/app.error.js";

const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

export function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;
    let settled = false;

    function cleanup() {
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("error", onError);
      req.off("aborted", onAborted);
    }

    function fail(error: Error) {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    }

    function onData(chunk: Buffer) {
      totalSize += chunk.length;

      if (totalSize > MAX_BODY_SIZE) {
        req.pause();
        fail(new PayloadTooLargeError());
        return;
      }

      chunks.push(chunk);
    }

    function onEnd() {
      if (settled) return;
      settled = true;
      cleanup();

      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(JSON.parse(body) as unknown);
      } catch (error) {
        reject(error);
      }
    }

    function onError(error: Error) {
      fail(error);
    }

    function onAborted() {
      fail(new Error("Request aborted"));
    }

    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("aborted", onAborted);
  });
}
