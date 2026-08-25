import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import routeMetadata from "./route-metadata.json";

const SITE_ORIGIN = "https://luvnote.app";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/icon-512.png`;

type PageMeta = {
  title: string;
  description: string;
  canonicalPath: string | null;
  robots: string;
};

function metadataForPath(pathname: string): PageMeta {
  const metadata = routeMetadata as Record<string, PageMeta>;
  if (pathname.startsWith("/c/")) return metadata["/connect"];
  if (metadata[pathname]) return metadata[pathname];
  return metadata.__not_found__;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

function removeCanonicalAndOpenGraphURL() {
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.head.querySelector('meta[property="og:url"]')?.remove();
}

export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metadataForPath(pathname);
    const canonical = meta.canonicalPath ? `${SITE_ORIGIN}${meta.canonicalPath}` : null;

    document.title = meta.title;
    if (canonical) upsertCanonical(canonical);
    else removeCanonicalAndOpenGraphURL();
    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.robots);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Luv");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    if (canonical) upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", DEFAULT_IMAGE);
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", DEFAULT_IMAGE);
  }, [pathname]);

  return null;
}
