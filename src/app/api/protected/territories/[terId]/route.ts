import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import { adminPermissions } from "@/lib/permissions";
import Territory from "@/models/territory";
import { handleDeleteImage } from "@/lib/cloudinary";
//import { deleteImageFromCloudinary } from '@lib/cloudinary'
//import { parse } from 'path'

export async function GET(
  _req: NextRequest,
  route: { params: { terId: string } }
) {
  const publisherId = route.params.terId;

  try {
    await connectDb();
    const existingTerritories = await Territory.countDocuments({ publisherId });

    return NextResponse.json({ data: existingTerritories }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Не найдено!" }, { status: 404 });
  }
}

// export async function PUT(req, { params }) {
//   const token = await getToken({ req })
//   if (token.status !== 'admin') {
//     return NextResponse.json({ error: 'В доступе отказано', status: 403 })
//   }

//   const id = params.terId

//   const body = await req.json()

//   try {
//     await connectDb()
//     const updatedterritory = await Territory.findByIdAndUpdate(
//       id,
//       { ...body },
//       {
//         new: true,
//         runValidators: true,
//         context: 'query',
//       }
//     )

//     return NextResponse.json({ data: updatedterritory, status: 200 })
//   } catch (error) {
//     return NextResponse.json({ error: error.message.split(':')[2].trimStart().split(',')[0], status: 500 })
//   }
// }

export async function PATCH(
  req: NextRequest,
  route: { params: { terId: string } }
) {
  await adminPermissions();
  const token = await getToken({ req });
  const id = route.params.terId;

  if (!token) {
    return NextResponse.json(
      { error: "Пользователь не определён!" },
      { status: 404 }
    );
  }

  const {
    name,
    publisherId,
    comment,
    given,
    returned,
    returning,
    address,
    image /* , base64Image */,
  } = await req.json();

  try {
    await connectDb();
    const existingTerritory = await Territory.findById(id)
      .populate("user", "name")
      .select({
        address: 0,
        //image: 0,
        //base64Image: 0,
      });

    if (!existingTerritory) {
      return NextResponse.json({ error: "Не найден!" }, { status: 404 });
    }

    // 1a. Update terr-ry with new data: territory given
    if (name) {
      existingTerritory.available = false;
      existingTerritory.given = new Date();
      existingTerritory.returned = null;
      existingTerritory.user = token.id;
      existingTerritory.publisher = name;
      existingTerritory.publisherId = publisherId;
    } else if (returning && existingTerritory.given) {
      // 1b. Update terr-ry with new data: territory returned
      const object = {
        user: token.id,
        publisher: existingTerritory.publisher,
        publisherId: existingTerritory.publisherId,
        returned: new Date(),
        given: existingTerritory.given,
      };

      existingTerritory.available = true;
      existingTerritory.returned = new Date();
      existingTerritory.given = null;
      existingTerritory.publisher = "";
      existingTerritory.publisherId = "";
      existingTerritory.user = token?.id;
      existingTerritory.history.push(object);
    } else if (returned) {
      //  2a. Update terr-ry with new data: change returned date (and comment) for newly added territory
      existingTerritory.comment = comment;
      existingTerritory.returned = returned;
    } else if (given) {
      //  2b. Update terr-ry with new data: change given date (and comment)
      existingTerritory.comment = comment;
      existingTerritory.given = given;
    } else if (address) {
      //  2c. Update terr-ry with new data: change address
      existingTerritory.address = address;
    } else if (image) {
      //  2d. Update terr-ry with new data: change image
      existingTerritory.image = image;
      //existingTerritory.base64Image = base64Image
    } else {
      // 2e. Update terr-ry with new data: change ONLY comment added/updated/cleared
      existingTerritory.comment = comment;
    }

    const result = await existingTerritory.save();

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error:
          /* error?.message.split(":")[2].trimStart().split(",")[0] ?? */ "Ошибка!",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  route: { params: { terId: string } }
) {
  await adminPermissions();

  const id = route.params.terId;

  try {
    await connectDb();
    const terToDelete = await Territory.findByIdAndDelete(id);

    if (terToDelete?.image) {
      const publicId =
        "territories" + "/" + terToDelete.image.split("/").pop().split(".")[0];

      await handleDeleteImage(publicId);
    }

    return NextResponse.json({ data: terToDelete }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка на сервере!" }, { status: 500 });
  }
}
