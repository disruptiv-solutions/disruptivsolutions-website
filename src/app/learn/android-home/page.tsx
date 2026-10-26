import type { Metadata } from 'next';
import AndroidHomeLesson from './AndroidHomeLesson';
import { lessonHtml } from './lesson-content';
import { ANDROID_HOME_DISCUSSION_URL } from './discussion';
import './lesson.css';
import './site-integration.css';

export const metadata: Metadata = {
  title: 'Build your own Android home screen | Ian McDonald AI',
  description: 'Try two interactive Android home screens, then build your own with five practical chapters, copyable prompts, and a free downloadable agent skill.',
  alternates: { canonical: '/learn/android-home' },
  openGraph: {
    title: 'Build your own Android home screen',
    description: 'Your phone, your day. A practical lesson and a skill for your coding agent.',
    url: '/learn/android-home',
    images: [{ url: '/learn/android-home/android-home-teaser.png', width: 1080, height: 1080, alt: 'Ian’s custom Android home screen' }],
  },
};

export default function AndroidHomePage() {
  return <AndroidHomeLesson html={lessonHtml.replaceAll('__ANDROID_DISCUSSION__', ANDROID_HOME_DISCUSSION_URL)} />;
}
