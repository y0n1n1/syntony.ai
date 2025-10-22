import GradientText from '@/components/custom/GradientLogo';
import PhotoGallery from '@/components/custom/PhotoGallery';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Mission = () => {
  return (
    <div className='ml-56 flex flex-row justify-start mt-12'>
      <div className='w-6/12'>
        <h1 className='text-4xl font-semibold pb-6 text-stone-800'><GradientText/>'s Mission</h1>
        <p className='text-stone-600 '>August 28, 2024</p>
        <p className='text-stone-600  pb-6'>By Gabriel Gramicelli, Founder and CEO</p>
        <p className='py-4'>Syntony’s goal is to accelerate the research process. We plan on doing that through our research tool, which allows users to search with clarity.</p>

        {/* Section 1 */}
        <h2 id="whats-bad-today" className='text-2xl font-semibold text-stone-800 pb-3'>What’s bad today</h2>
        <p className='py-4'>Virtually every search engine for scientific articles, publications, and conferences has outdated designs, minimally customisable search engines, and often produce results which aren’t great.</p>
        <p className='py-4'>This is something we all know. The research community, and specifically the AI/ML community knows that websites like Google Scholar have been virtually unchanged since their initial release. These tools contain very archaic ways of specifying your search queries.</p>
      
        <PhotoGallery photos={["public/mission/Mission1.png", "public/mission/Mission2.png", "public/mission/Mission3.png", "public/mission/Mission4.png", "public/mission/Mission5.png", "public/mission/Mission6.png"]} />
        <p className='pl-5 pt-2 pb-6 text-stone-600 text-sm'>Photo Descriptions (websites on August 2024)</p>
        <p className='py-4'>Utilising these tools causes researchers to spend significant amounts of time reading through papers that are not relevant to their research.</p>

        {/* Section 2 */}
        <h2 id="syntonys-approach" className='text-2xl font-semibold text-stone-800 pb-3'>Syntony’s approach to a Research engine</h2>
        <p className='py-4'>Syntony stems from the fact that researchers spend a disproportionate amount of time having to find and filter through an unnecessarily large amount of papers in order to find what they look for.</p>
        <p className='py-4'>Search engines like Google are great in taking the minimum amount of information - sometimes as little as a word - and providing great results. However, most researchers would prefer to spend a few more minutes crafting their search to save hours reading articles.</p>

        {/* Section 3 */}
        <h2 id="our-dev-plan" className='text-2xl font-semibold text-stone-800 pb-3'>Our dev plan</h2>
        <p className='py-4'>We plan on developing syntony from the simplest features to the most intricate ones...</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { version: "V0", description: "The simplest version, with only the bare-bones search engine." },
              { version: "V1", description: "The core version, with most essential non-AI features." },
              { version: "V2", description: "The first implementation of AI." },
              { version: "V3", description: "The first official release." },
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.version}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className='py-4'>To stay updated on developments, stay active! We are constantly improving the site</p>
      </div>

      <div className='ml-32'>
        <h1 className='font-light text-stone-600 text-2xl mb-5'>Contents</h1>
        <div className='j'>
          <h1 className='my-3 font-medium text-xl text-stone-600'><a href="#whats-bad-today" className='my-3 font-medium'>What’s bad today</a></h1>
          <h1 className='my-3 font-medium text-xl text-stone-600'><a href="#syntonys-approach" className='my-3 font-medium'>Syntony’s approach to a Research engine</a></h1>
          <h1 className='my-3 font-medium text-xl text-stone-600'>
          <a href="#our-dev-plan" className='my-3 font-medium'>Our dev plan</a></h1>
          
        </div>
      </div>
    </div>
  );
}

export default Mission;
