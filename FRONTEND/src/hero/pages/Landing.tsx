import { useSearch } from "@/_search/searchProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RandomPlaceholderInput from "@/components/custom/RandomPlaceholderInput";
import { useAuth } from "@/api/authContext";
import { SearchIcon } from "lucide-react";



const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/landing';

    const handleRedirect = () => {
        // Redirect to a specific route
        navigate('/home');  // Replace with your desired route
    };

  
  const { user } = useAuth(); // Access user and logout function
  useEffect(() => {
    if (user?.id && (!isLandingPage)){handleRedirect()

    }
  }, [user]);
  const { setSearchInput } = useSearch();  // Get the setter from context
    const [inputValue, setInputValue] = useState(""); // Local state for input
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      // Update the global search input in the context
      setSearchInput(inputValue);
  
      // Navigate to the search page
      navigate("/search");
    };
  const images = [
    {
      src: "public/landing/magicpattern-bevXKKL7E9g-unsplash.jpg",
      title: <h2 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl">ReSearch Beta</h2>,
      text: <p className="text-white mt-2 text-lg text-center">A Beta version of Syntony's ReSearch Engine powered by GPT-4o mini</p>,
    },
    {
      src: "public/landing/magicpattern-iAR6yhCkrxc-unsplash.jpg",
      title: <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl">Search with purpose</h2>,
      text:  <div className="w-72 sm:w-72 md:w-80 lg:w-96 ml-12"><form onSubmit={handleSubmit} className="flex items-center space-x-2 py-3 text-black">
      <RandomPlaceholderInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
  
        
      />
            <Button className="bg-transparent" type="submit"><SearchIcon className="z-50 bg-white text-black w-48 h-48 -ml-24 "/></Button>
    </form></div>,
    },
    {
      src: "public/landing/GREEN.jpg",
      title: <h2 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-6xl flex flex-row">The <p className="text-white text-xl sm:text-2xl md:text-4xl lg:text-6xl italic px-1 md:px-2 "> research </p> engine for scientists</h2>,
      text: <div className="flex flex-col items-center align-middle w-full"><p className="text-white mt-2  text-sm sm:text-base md:text-lg">Syntony's unique mission is to create a search engine that will save time and accelerate scientific research</p>
      <div className="flex flex-col md:flex-row py-4 md:py-20 items-center align-middle"><div className="flex flex-col items-center align-middle px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl md:text-4xl font-extralight pb-5">AI Understanding</h1>
        <p className="w-64 sm:w-72 md:w-72 lg:w-96 items-center align-middle text-justify text-sm sm:text-base md:text-lg">Syntony collects AI-generated metadata about scientific papers. This makes classifying papers a much easier task. What if you want to filter search results that are meta studies, or only the ones that measure BLEU? With Syntony, you can do that</p>
        </div><div className="flex flex-col items-center align-middle px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl md:text-4xl font-extralight pb-5">Less time reading</h1>
        <p className="w-64 sm:w-72 md:w-72 lg:w-96 items-center align-middle text-justify text-sm sm:text-base md:text-lg ">Syntony runs on the principle that if more time is spent crafting expressive search queries (that will eliminate irrelevant results), less time needs to be spent reading articles that don't end up contributing to your research</p>
        
        </div></div></div>,
    },
    {
      src: "public/landing/vincent-maufay-MWj1zsf5yjM-unsplash.jpg",
      title: <h2 className="text-white text-4xl">We are looking for beta users that will give us direct feedback</h2>,
      text: <div><Link to="/sign-up"><Button className="bg-white rounded-full m-5 h-16 w-64 text-blue-950 text-xl hover:bg-stone-100">Become a Beta User</Button></Link></div>,
    },
  ];


  return (
    <div className="w-svw">
      {/*
      <div className="h-svh">
        THIS WILL SHOW AN ANIMATION WITH THE LATEST articles and it will be really cool like cosmos.so
      </div>*/}
    <div className="flex overflow-x-scroll snap-x snap-mandatory pl-24 pr-24 space-x-8 p-4 no-scrollbar">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 w-full h-[700px] bg-cover bg-center rounded-lg shadow-lg snap-center `}
          style={{
            backgroundImage: `url(${image.src})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg p-1 sm:p-2 md:p-4 flex flex-col  justify-center items-center">
            <h2 className="text-white text-8xl">{image.title}</h2>
            <p className="text-white mt-2 text-lg">{image.text}</p>
          </div>
        </div>
      ))}
    </div>
   
    </div>
  );
};

export default Landing;