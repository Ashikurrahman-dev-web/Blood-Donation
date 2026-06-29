import { NextResponse } from "next/server";

import Funding from "@/models/Funding";

export async function GET() {
  await dbConnect();

  const fundings = await Funding.find()
    .sort({ createdAt: -1 });
  return NextResponse.json(fundings);
}

export async function POST(req) {
  await dbConnect();

  const data = await req.json();

  const result = await Funding.create(data);

  return NextResponse.json(result);
}