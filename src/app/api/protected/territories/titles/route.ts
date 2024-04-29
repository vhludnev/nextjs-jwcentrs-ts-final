import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { adminPermissions } from "@/lib/permissions";
import Territory from "@/models/territory";

/* get all territory titles */
export async function GET() {
  await adminPermissions();

  try {
    await connectDb();
    const titles = await Territory.find({}).lean().distinct("title");

    return NextResponse.json({ data: titles }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка на сервере" },
      { status: 500 }
    );
  }
}
