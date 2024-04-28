import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl) {
    return NextResponse.json({ data: "" });
  }

  const buffer = await fetch(imageUrl).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { base64 } = await getPlaiceholder(buffer);

  return NextResponse.json({ data: base64 });
}
