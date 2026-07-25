import {
  clearStyleGuideSlot,
  readStyleGuideSlots,
  saveStyleGuideSlot,
} from "@/utils/style-guide-slots";

export const runtime = "nodejs";

type StyleGuideSlotRequest = {
  action?: "clear" | "save";
  name?: string;
  slotId?: string;
  tokens?: unknown;
};

function isDevDisabled() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  );
}

export async function GET() {
  if (isDevDisabled()) {
    return jsonError("Style guide slots are disabled in production.", 403);
  }

  return Response.json({ ok: true, slots: await readStyleGuideSlots() });
}

export async function POST(request: Request) {
  if (isDevDisabled()) {
    return jsonError("Style guide slots are disabled in production.", 403);
  }

  let body: StyleGuideSlotRequest;

  try {
    body = (await request.json()) as StyleGuideSlotRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    if (body.action === "clear") {
      return Response.json({
        ok: true,
        slots: await clearStyleGuideSlot(body.slotId ?? ""),
      });
    }

    if (body.action === "save") {
      return Response.json({
        ok: true,
        slots: await saveStyleGuideSlot({
          name: body.name ?? "",
          slotId: body.slotId ?? "",
          tokens: body.tokens,
        }),
      });
    }

    return jsonError("Unknown style guide slot action.", 400);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Style guide slot request failed.",
      400,
    );
  }
}

function jsonError(error: string, status: number) {
  return Response.json({ error, ok: false }, { status });
}
