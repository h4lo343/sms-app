import schedule from "node-schedule";
export async function DELETE(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!schedule.scheduledJobs[taskUuid]) {
    return new Response("the task does not exist", {
      status: 200,
    });
  } else {
    schedule.scheduledJobs[taskUuid]?.cancel();
    return new Response(`successfully deleted task: ${taskUuid}`, {
      status: 200,
    });
  }
}

export async function GET(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!schedule.scheduledJobs[taskUuid]) {
    return new Response("the task does not exist", {
      status: 200,
    });
  } else {
    return new Response(schedule.scheduledJobs[taskUuid].nextInvocation(), {
      status: 200,
    });
  }
}
