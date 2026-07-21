"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { StrategyIndexMenu } from "./StrategyIndexMenu";

export type WorkspaceNavIconName =
  | "agent"
  | "dashboard"
  | "download"
  | "intake"
  | "pagebuilder"
  | "plan"
  | "prompts"
  | "sections"
  | "stagedPages"
  | "strategy"
  | "style"
  | "templates"
  | "contentEditor";

export type WorkspaceNavItem = {
  icon: WorkspaceNavIconName;
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  openInNewTab?: boolean;
  tone: "blue" | "orange" | "purple" | "green" | "pink" | "yellow" | "teal" | "indigo" | "slate";
};

type WorkspaceNavProps = {
  activeTool: string;
  clientSlug: string;
  navigationItems: WorkspaceNavItem[];
  pageActions: ReactNode;
  pageTitle: string;
};

const formattedClientNameAcronyms = new Set(["hvac", "llc", "usa"]);

export function formatWorkspaceClientName(clientSlug: string) {
  return clientSlug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const normalizedWord = word.toLowerCase();

      return formattedClientNameAcronyms.has(normalizedWord)
        ? normalizedWord.toUpperCase()
        : `${normalizedWord.charAt(0).toUpperCase()}${normalizedWord.slice(1)}`;
    })
    .join(" ");
}

export function WorkspaceNav({
  activeTool,
  clientSlug,
  navigationItems,
  pageActions,
  pageTitle,
}: WorkspaceNavProps) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--workspace-nav-height",
        `${header.offsetHeight}px`,
      );
    };
    const observer = new ResizeObserver(updateHeight);

    observer.observe(header);
    updateHeight();

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--workspace-nav-height");
    };
  }, []);

  return (
    <header
      className="strategy-toolbar fixed inset-x-0 top-0 z-40 border-b px-[var(--container-gutter)] py-3"
      ref={headerRef}
    >
      <nav aria-label={`${pageTitle} workspace navigation`} className="strategy-toolbar-nav">
        <div className="strategy-toolbar-identity">
          <div className="strategy-toolbar-shortcuts">
            <Link
              aria-label="My Dashboard"
              className="strategy-toolbar-shortcut"
              href="/dev/dashboard"
              title="My Dashboard"
            >
              <WorkspaceNavIcon icon="dashboard" />
            </Link>
            <Link
              aria-label="Client Intake"
              className="strategy-toolbar-shortcut"
              href="/client-intake"
              title="Client Intake"
            >
              <WorkspaceNavIcon icon="intake" />
            </Link>
          </div>
          <h1 className="strategy-toolbar-title type-caption">
            {pageTitle} | {formatWorkspaceClientName(clientSlug)}
          </h1>
        </div>

        <div className="strategy-toolbar-tools">
          {navigationItems.filter((item) => item.id !== activeTool).map((item) => {
            const className = "strategy-toolbar-control strategy-toolbar-tool type-caption";
            const content = (
              <>
                <WorkspaceNavIcon icon={item.icon} />
                {item.label}
              </>
            );

            if (item.href) {
              return (
                <Link
                  className={className}
                  data-tone={item.tone}
                  href={item.href}
                  key={item.id}
                  rel={item.openInNewTab ? "noreferrer" : undefined}
                  target={item.openInNewTab ? "_blank" : undefined}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                className={className}
                data-tone={item.tone}
                key={item.id}
                onClick={item.onClick}
                type="button"
              >
                {content}
              </button>
            );
          })}
        </div>

        <div className="strategy-toolbar-utilities">{pageActions}</div>
      </nav>
    </header>
  );
}

export function WorkspaceNavDivider() {
  return <span aria-hidden="true" className="strategy-toolbar-divider" />;
}

export function WorkspaceNavAgentDocLink({ clientSlug }: { clientSlug: string }) {
  return (
    <Link
      className="strategy-toolbar-agent-doc"
      href={`/api/agent-export?clientSlug=${encodeURIComponent(clientSlug)}`}
      rel="noreferrer"
      target="_blank"
    >
      <WorkspaceNavIcon icon="download" />
      Agent Doc
    </Link>
  );
}

export function WorkspaceNavIndex({ clientSlug }: { clientSlug: string }) {
  return <StrategyIndexMenu clientSlug={clientSlug} />;
}

export function WorkspaceNavIcon({ icon }: { icon: WorkspaceNavIconName }) {
  const paths: Record<WorkspaceNavIconName, string[]> = {
    agent: ["M8 5h8", "M7 9h10", "M7 13h6", "M5 3h14v18H5z"],
    contentEditor: ["M5 4h14v16H5z", "M8 8h8", "M8 12h5", "m14 15 3-3"],
    dashboard: ["M4 13h6v7H4z", "M14 4h6v7h-6z", "M14 14h6v6h-6z", "M4 4h6v5H4z"],
    download: ["M12 4v10", "M8 10l4 4 4-4", "M5 20h14"],
    intake: ["M12 3v18", "M3 12h18", "M5 5l14 14", "M19 5 5 19"],
    pagebuilder: ["M4 5h7v7H4z", "M13 5h7v4h-7z", "M13 11h7v8h-7z", "M4 14h7v5H4z"],
    plan: ["M7 4h10l3 3v13H7z", "M17 4v4h4", "M10 11h7", "M10 15h5"],
    prompts: ["M5 6h14v10H8l-3 3z", "M8 10h8", "M8 13h5"],
    sections: ["M5 5h14v4H5z", "M5 11h14v4H5z", "M5 17h14v2H5z"],
    stagedPages: ["M5 4h14v16H5z", "M8 8h8", "M8 12h8", "M8 16h5"],
    strategy: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "m15 9-2.3 4.7L8 16l2.3-4.7L15 9Z"],
    style: ["M12 4l7 4v8l-7 4-7-4V8z", "M12 4v16", "M5 8l7 4 7-4"],
    templates: ["M4 5h16v14H4z", "M8 5v14", "M4 10h16", "M12 10v9"],
  };

  return (
    <svg aria-hidden="true" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {paths[icon].map((path) => <path d={path} key={path} />)}
    </svg>
  );
}
