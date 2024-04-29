import { NextRequest, NextResponse } from "next/server";
//import { getToken } from "next-auth/jwt";
import connectDb from "@/lib/connectDb";
import Territory from "@/models/territory";

export async function GET(
  _req: NextRequest,
  route: { params: { terId: string } }
) {
  const id = route.params.terId;

  try {
    await connectDb();
    const existingTerritory = await Territory.findById(id).select({
      title: 1,
      code: 1,
      address: 1,
      comment: 1,
      image: 1,
      //base64Image: 1
    });

    return NextResponse.json({ data: existingTerritory }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Не найдено!" }, { status: 404 });
  }
}

// export async function PATCH(
//   req: NextRequest,
//   route: { params: { terId: string } }
// ) {
//   const token = await getToken({ req });
//   const id = route.params.terId;

//   const { returning } = await req.json();

//   try {
//     await connectDb();
//     const existingTerritory = await Territory.findById(id)
//       .populate("user", "name")
//       .select({
//         address: 0,
//         image: 0,
//       });

//     if (!existingTerritory) {
//       return NextResponse.json({ error: "Не найден!" }, { status: 404 });
//     }

//     if (existingTerritory && existingTerritory.publisherId !== token?.id) {
//       return NextResponse.json({ error: "Не допуска!" }, { status: 404 });
//     }

//     if (returning && existingTerritory.given) {
//       // Update terr-ry with new data: territory returned
//       const object = {
//         user: token?.id,
//         publisher: existingTerritory.publisher,
//         publisherId: existingTerritory.publisherId,
//         returned: new Date(),
//         given: existingTerritory.given,
//       };

//       existingTerritory.available = true;
//       existingTerritory.returned = new Date();
//       existingTerritory.given = null;
//       existingTerritory.publisher = "";
//       existingTerritory.publisherId = "";
//       existingTerritory.user = token?.id;
//       existingTerritory.history.push(object);
//     }

//     const result = await existingTerritory.save();

//     return NextResponse.json({ data: result }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         error:
//           /* error?.message?.split(':')[2].trimStart().split(',')[0] */ "Ошибка!",
//       },
//       { status: 500 }
//     );
//   }
// }
