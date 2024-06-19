import getReport from "@/app/utils/getReport";

export async function GET(request) {
  const taskUuid = request.nextUrl.searchParams.get("taskUuid");
  const report = await getReport(taskUuid);
  console.log(report);
  return new Response(JSON.stringify(report), {
    status: 200,
  });
}
