import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDb from "@/lib/connectDb";
import Territory from "@/models/territory";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  const publisherId = token?.id;
  try {
    await connectDb();
    const territories = await Territory.find({
      publisherId,
    })
      .sort({ given: 1 })
      .select({ title: 1, code: 1, address: 1, given: 1 });

    return NextResponse.json({ data: territories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка на сервере" },
      { status: 500 }
    );
  }
}
