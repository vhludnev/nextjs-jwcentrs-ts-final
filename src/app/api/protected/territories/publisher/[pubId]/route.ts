import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Territory from "@/models/territory";

export async function GET(
  _req: NextRequest,
  route: { params: { pubId: string } }
) {
  const publisherId = route.params.pubId;

  const today = new Date();
  const fourMonthAgo = today.setMonth(today.getMonth() - 4);

  try {
    await connectDb();
    const existingTerritories = await Territory.find({
      publisherId,
      given: { $lt: fourMonthAgo },
    })
      .sort({ title: 1 })
      .select({ title: 1, code: 1 });

    return NextResponse.json({ data: existingTerritories }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Не найдено!" }, { status: 404 });
  }
}
