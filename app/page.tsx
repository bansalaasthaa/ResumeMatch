import Banner1 from "@/components/LandingPage/Banner1";
import CallToAction from "@/components/LandingPage/CallToAction";
import FeaturesBanner from "@/components/LandingPage/FeatureBanner";
import Navbar from "@/components/LandingPage/Navbar";
import ResumeMatchStats from "@/components/ResumeMatchStats";;
export default async function Home() {
  return (
    <div >
      <div className="bg-black bg-center h-full">
        <Navbar />
        <Banner1 />
        <FeaturesBanner />
        <ResumeMatchStats/>
        <CallToAction/>
      </div>
      <div className="">
      </div>
    </div>
  )
}