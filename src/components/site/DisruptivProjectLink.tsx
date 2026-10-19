"use client";
import { trackDisruptivVisit } from "@/lib/analytics";
export default function DisruptivProjectLink({ className, location = "start_page" }: { className?: string; location?: string }) {
  const href = "https://www.disruptiv.solutions/contact";
  return <a href={href} className={className} onClick={() => trackDisruptivVisit(href, location)}>Start a project →</a>;
}
