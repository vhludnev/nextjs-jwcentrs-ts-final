import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import { adminPermissions } from "@/lib/permissions";
import Territory from "@/models/territory";

/* get all territories */
export async function GET(req: NextRequest) {
  await adminPermissions();

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  try {
    await connectDb();
    let territories;
    //const territories = await Territory.find({}) /* .sort({ title: 1, code: 1 }) */
    if (title === "all") {
      territories = await Territory.find({}).populate("user", "name").select({
        address: 0,
        image: 0,
        //base64Image: 0,
      });
    } else {
      // {title: { "$regex": "Alex", "$options": "i" }}
      // territories = await Territory.find({ title })
      territories = await Territory.find({ title: { "$regex": title, "$options": "i" } })
        .populate("user", "name")
        .select({
          address: 0,
          image: 0,
          //base64Image: 0,
        });
    }

    return NextResponse.json({ data: territories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка на сервере" },
      { status: 500 }
    );
  }
}

/* add new territory */
export async function POST(req: NextRequest) {
  await adminPermissions();

  const token = await getToken({ req });
  const data = await req.json();
  try {
    await connectDb();
    const territory = new Territory({
      ...data,
      available: true,
      user: token?.id,
    });
    await territory.validate();
    const savedterritory = await territory.save();

    return NextResponse.json({ data: savedterritory }, { status: 201 });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return NextResponse.json(
        { error: "Данная территория уже существует" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error.message.split(":")[2].trimStart() },
      { status: 500 }
    );
  }
}
