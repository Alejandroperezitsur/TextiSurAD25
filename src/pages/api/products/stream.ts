import type { NextApiRequest, NextApiResponse } from "next";
import emitter from "@/lib/events";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ type: "hello" })}\n\n`);

  const onUpdate = (payload: unknown) => {
    try {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch {}
  };

  emitter.on("products:update", onUpdate);
  req.on("close", () => {
    emitter.off("products:update", onUpdate);
    try { res.end(); } catch {}
  });
}