
import { Button } from "@/components/ui/button"
import {  useNavigate } from "react-router-dom"

import RandomPlaceholderInput from "@/components/custom/RandomPlaceholderInput";
import { useState } from "react";

import {  useSearch } from "./../searchProvider"; // Adjust the import path
import { SearchIcon } from "lucide-react";


const Home = () => {
    const { setSearchInput } = useSearch();  // Get the setter from context
    const [inputValue, setInputValue] = useState(""); // Local state for input
    const navigate = useNavigate();  // Hook to navigate programmatically
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      // Update the global search input in the context
      setSearchInput(inputValue);
  
      // Navigate to the search page
      navigate("/search");
    };

  return (
        <div className="absolute left-0 right-0" >
        <section className="flex justify-center items-center flex-col mt-10">
            <a href='/'><img src="public/assets/TEXT_LOGO.svg" alt="logo"
                    className=" m-1 object-cover h-30 w-60  t-50"/></a>
    <div className="w-full"><div className="flex flex-row justify-center w-full">
        <div className="w-4/12 m-5">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="flex w-full items-center space-x-2 ml-6">
            {/* Random Placeholder Input for Keywords */}
            <RandomPlaceholderInput
            value={inputValue}
            /* onChange={(e) => setFormValues({ ...formValues, titlesIncludes: e.target.value })} */
            onChange={(e) => setInputValue(e.target.value)}
            />
            <Button className="bg-white" type="submit"><SearchIcon className="z-50 text-black w-48 h-48 -ml-24 "/></Button>
         </div>
              </form>
        </div>
        
    </div></div>        
    
    
        </section> 
        </div>
        
  )
  }
  
  export default Home