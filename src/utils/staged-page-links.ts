type StagedPreviewTarget = {
  clientSlug: string;
  pageId: string;
  previewHref?: string;
};

export function getStagedPreviewHref({
  clientSlug,
  pageId,
  previewHref,
}: StagedPreviewTarget) {
  const pathname = previewHref || `/dev/staged-pages/${pageId}`;
  const separator = pathname.includes("?") ? "&" : "?";

  return `${pathname}${separator}client=${encodeURIComponent(clientSlug)}`;
}
