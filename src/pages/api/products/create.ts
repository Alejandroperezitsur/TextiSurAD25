import type { NextApiRequest, NextApiResponse } from "next"
import handler from "./index"

export default async function create(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res)
}