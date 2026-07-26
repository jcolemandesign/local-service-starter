import { beforeAll, describe, expect, it } from "vitest";
import {
  getContentEditorPages,
  type ContentEditorPage,
} from "@/content/content-editor";

describe("content editor field references", () => {
  let pages: ContentEditorPage[] = [];

  beforeAll(async () => {
    pages = await getContentEditorPages();
  });

  it("provides a contract example for every staged copy field", () => {
    const emptyTemplateCopyFields = pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.filter(
          (field) =>
            field.kind === "copy" &&
            !field.path.startsWith("strategy.") &&
            !field.value.trim(),
        ),
      ),
    );

    expect(emptyTemplateCopyFields.length).toBeGreaterThan(0);
    expect(
      emptyTemplateCopyFields
        .filter(
          (field) =>
            field.fallback?.source !== "template-example" ||
            field.fallback.exact !== false ||
            !field.fallback.value.trim(),
        )
        .map((field) => field.path),
    ).toEqual([]);
  });

  it("normalizes repeated copy examples into editable multiline text", () => {
    const multilineExample = pages
      .flatMap((page) => page.sections)
      .flatMap((section) => section.fields)
      .find(
        (field) =>
          field.fallback?.source === "template-example" &&
          field.fallback.value.includes("\n"),
      );

    expect(multilineExample).toBeDefined();
  });

  it("marks image defaults as exact without inventing meta defaults", () => {
    const fields = pages
      .flatMap((page) => page.sections)
      .flatMap((section) => section.fields);
    const imageFields = fields.filter((field) => field.kind === "image");
    const contentDirection = fields.find((field) =>
      field.path.endsWith(".contentDirection"),
    );
    const imageRatio = fields.find((field) =>
      field.path.endsWith(".imageRatio"),
    );

    expect(imageFields.length).toBeGreaterThan(0);
    expect(
      imageFields.every(
        (field) =>
          field.fallback?.source === "template-default" &&
          field.fallback.exact === true &&
          field.fallback.value.trim().length > 0,
      ),
    ).toBe(true);
    expect(contentDirection?.fallback).toBeUndefined();
    expect(imageRatio?.fallback).toBeUndefined();
  });
});
