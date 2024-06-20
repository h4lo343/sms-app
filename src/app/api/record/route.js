import getReport from "@/app/utils/getReport";
import { NextResponse } from "next/server";

export async function GET(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!taskUuid)
    return NextResponse.json({ msg: "task uuid missed" }, { status: 400 });
  const report = await getReport(taskUuid);
  return NextResponse.json({ data: report }, { status: 200 });
}
