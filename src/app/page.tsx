import Hero from '@/components/Hero';
import WhoThisIsFor from '@/components/WhoThisIsFor';
import LaunchBox from '@/components/LaunchBox';
import MyStory from '@/components/MyStory';
import Portfolio from '@/components/Portfolio';
import Approach from '@/components/Approach';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <WhoThisIsFor />
      <MyStory />
      <LaunchBox />
      <Portfolio />
      <Approach />
      <Contact />
    </>
  );
}
