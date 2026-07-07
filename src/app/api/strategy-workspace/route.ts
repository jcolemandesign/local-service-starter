import {
  readStrategyWorkspace,
  sanitizeClientSlug,
  writeStrategyWorkspace,
  type StrategyWorkspaceFields,
} from "@/utils/strategy-workspace";
import { syncStagedPagesFromStrategySnapshot } from "@/utils/staged-pages";
import { writeStrategySnapshot } from "@/utils/strategy-snapshots";

export const runtime = "nodejs";

type StrategyWorkspaceSaveRequest = {
  clientSlug?: unknown;
  fields?: Partial<StrategyWorkspaceFields>;
};

export async function GET(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Strategy workspace reads are disabled in production.", 403);
  }

  const url = new URL(request.url);
  const clientSlug = sanitizeClientSlug(url.searchParams.get("clientSlug"));

  if (!clientSlug) {
    return jsonError("Missing project slug.", 400);
  }

  try {
    const workspace = await readStrategyWorkspace(clientSlug);

    return Response.json({
      ok: true,
      workspace,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Strategy workspace read failed.",
      400,
    );
  }
}

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Strategy workspace saves are disabled in production.", 403);
  }

  let body: StrategyWorkspaceSaveRequest;

  try {
    body = (await request.json()) as StrategyWorkspaceSaveRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const clientSlug = sanitizeClientSlug(body.clientSlug);

  if (!clientSlug) {
    return jsonError("Missing project slug.", 400);
  }

  try {
    const workspace = await writeStrategyWorkspace(clientSlug, body.fields ?? {});
    const snapshot = await writeStrategySnapshot(workspace);
    const stagedSync = await syncStagedPagesFromStrategySnapshot(snapshot);

    return Response.json({
      ok: true,
      snapshot,
      stagedSync,
      workspace,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Strategy workspace save failed.",
      400,
    );
  }
}

function jsonError(message: string, status: number) {
  return Response.json(
    {
      message,
      ok: false,
    },
    { status },
  );
}
