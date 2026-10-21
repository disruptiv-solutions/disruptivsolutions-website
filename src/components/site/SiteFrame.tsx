"use client";

import { usePathname } from 'next/navigation';
import { isEditorialRoute } from '@/lib/site-routes';
import NavigationWrapper from '@/components/NavigationWrapper';
import ConditionalFooter from '@/components/ConditionalFooter';
import Footer from '@/components/Footer';
import SignUpModal from '@/components/SignUpModal';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  if (!isEditorialRoute(pathname)) return <><NavigationWrapper /><main className="relative">{children}</main><ConditionalFooter><Footer /></ConditionalFooter></>;
  const home = pathname === '/';
  return <div className={`editorial-site ${home ? 'editorial-home' : 'editorial-subpage'}`} data-page={pathname.split('/')[1] || 'home'}>
    <a className="site-skip-link" href="#main-content">Skip to content</a>
    <SiteHeader key={pathname} home={home} bookingHref={pathname === "/speaking" ? "/speaking#book" : undefined} />
    <main id="main-content" className="editorial-content">{children}<SignUpModal /></main>
    {(!pathname.startsWith('/kits/') || pathname === '/kits/find-leads') && <SiteFooter home={home} />}
  </div>;
}
