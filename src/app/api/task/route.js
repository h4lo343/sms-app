import { NextResponse } from "next/server";
import schedule from "node-schedule";
export async function DELETE(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!schedule.scheduledJobs[taskUuid]) {
    return NextResponse.json(
      { msg: `the task: ${taskUuid} does not exist` },
      { status: 404 }
    );
  } else {
    schedule.scheduledJobs[taskUuid]?.cancel();
    return NextResponse.json(
      { msg: `successfully deleted task: ${taskUuid}` },
      { status: 200 }
    );
  }
}

export async function GET(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!schedule.scheduledJobs[taskUuid]) {
    return NextResponse.json(
      { msg: `the task: ${taskUuid} does not exist` },
      { status: 404 }
    );
  } else {
    return NextResponse.json(
      { data: schedule.scheduledJobs[taskUuid].nextInvocation() },
      {
        status: 200,
      }
    );
  }
}
