import Hero from '@/components/Hero';
import WhoThisIsFor from '@/components/WhoThisIsFor';
import ImageSection from '@/components/ImageSection';
import Consulting from '@/components/Consulting';
import LaunchBox from '@/components/LaunchBox';
import Portfolio from '@/components/Portfolio';

export default function Home() {
  return (
    <>
      <Hero />
      <WhoThisIsFor />
      <ImageSection imagePath="/ian-stage.jpg" alt="Description" />
      <Consulting />
      <LaunchBox />
      <Portfolio />
    </>
  );
}
