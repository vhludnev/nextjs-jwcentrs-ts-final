import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { adminPermissions } from "@/lib/permissions";
import User from "@/models/user";

export async function GET() {
  await adminPermissions();

  try {
    await connectDb();

    const users = await User.find({}).sort({ name: 1 }).select({ name: 1 });

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка на сервере" },
      { status: 500 }
    );
  }
}
