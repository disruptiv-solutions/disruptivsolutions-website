import type { ReactNode } from 'react';

type Props = { children: ReactNode };

/**
 * LaunchBox-branded shell for platform update pages only (not other newsletters).
 * Colors: Signal Orange #F3701E, Cloud White #F7F2EC, Launch Blue #4B607F, Tan Relay #E8D8C9.
 */
export default function LaunchboxWeeklyLayout({ children }: Props) {
  return (
    <div className="launchbox-weekly-theme min-h-screen selection:bg-[#F3701E]/25 selection:text-[#2A3442]">
      {children}
    </div>
  );
}
