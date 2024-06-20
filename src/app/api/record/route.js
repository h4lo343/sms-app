import getReport from "@/app/utils/getReport";

export async function GET(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  if (!taskUuid)
    return new Response("task uuid missed", {
      status: 400,
    });
  const report = await getReport(taskUuid);
  return new Response(JSON.stringify(report), {
    status: 200,
  });
}
