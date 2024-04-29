import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import connectDb from '@/lib/connectDb'
import Event from '@/models/event'
import { startOfMonth, addMonths } from 'date-fns'
//import { adminPermissions } from '@/lib/permissions'

export async function GET() {
  try {
    await connectDb()
    const events = await Event.find({})

    return NextResponse.json({ data: events }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Произошла ошибка на сервере' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  const nextMonthFirstDay = startOfMonth(addMonths(new Date(data.date), 1))

  try {
    await connectDb()
    //const event = new Event(data)
    const event = new Event({ ...data, expireAt: nextMonthFirstDay })

    const savedevent = await event.save()

    return NextResponse.json({ data: savedevent }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message.split(':')[2].trimStart().split(',')[0] }, { status: 500 })
  }
}

// export async function DELETE() {
//   await adminPermissions();
//   let date = new Date();
//   date.setDate(0);
//   const lastDayOfPrevMonth = date.toISOString();

//   try {
//     await connectDb();
//     await Event.deleteMany({ end: { $lte: lastDayOfPrevMonth } });

//     return NextResponse.json({ message: "success" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
