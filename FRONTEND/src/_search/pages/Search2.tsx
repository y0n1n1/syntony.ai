import RandomPlaceholderInput from "@/components/custom/RandomPlaceholderInput"
import GeneralColumn from "@/components/shared/GeneralColumn"
import LoadingSearch from "@/components/shared/LoadingSearch"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TwoSlider } from "@/components/ui/MultiSlider"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { format, subYears } from "date-fns"; 
import { SearchIcon } from "lucide-react"
import { Link } from "react-router-dom"



const presentDate = new Date(); // Present day
  const startDate = subYears(presentDate, presentDate.getFullYear() - 1989); // Start at 1990

  // Slider min/max
  const logMin = 1; // Min for logarithmic scale
  const logMax = 100; // Max slider value (for 100 intervals)

  // Convert slider value (0 to 100) to a logarithmic scale and map to a date between 1990 and now
  const linearToLogDate = (value: number) => {
    const logValue = Math.log10(value + logMin); // Apply log10
    const proportion = (logValue - Math.log10(logMin)) / (Math.log10(logMax) - Math.log10(logMin)); // Calculate proportion

    // Find how far the date should go back in time (from present to 1990)
    const timeDifference = presentDate.getTime() - startDate.getTime();
    const timeOffset = timeDifference * proportion;

    // Calculate the corresponding date
    const correspondingDate = new Date(presentDate.getTime() - timeOffset);
    return correspondingDate;
  };
  const flipDate = (inputDate: Date): Date => {
    // Define the start date (January 1, 1990)
    const startDate = new Date('1990-01-01T00:00:00Z');
    // Define the present date (right now)
    const presentDate = new Date();
  
    // Calculate the midpoint date between startDate and presentDate
    const midpointTime = (startDate.getTime() + presentDate.getTime()) / 2;
    const midpointDate = new Date(midpointTime);
  
    // Calculate the time difference from the input date to the midpoint
    const timeDifference = inputDate.getTime() - midpointDate.getTime();
  
    // Reflect the input date across the midpoint
    const flippedTime = midpointDate.getTime() - timeDifference;
    const flippedDate = new Date(flippedTime);
  
    return flippedDate;
  };
  // Format the slider value into Month and Year
  const formatSliderLabel = (value: number) => {
    const date = flipDate(linearToLogDate(value));
    
    return format(date, "MMM yyyy"); // Format as "Month Year"
  };

  function linearToExponential(value: number): number | null {
    if (value === 100) return null;
    if (value === 1) return 0;
    if (value < 0 || value > 100) throw new Error("Value must be between 0 and 100");
    
    if (value <= 21) {
        // 0-20: Increment by 1s (0,1,2,3,...,20)
        return value-1;
    } else if (value <= 25) {
        // 21-40: Increment by 5s (25,30,35,40)
        return 20 + Math.round((value - 21)) * 5;
    } else if (value <= 35) {
        // 41-60: Increment by 10s (50,60,70,80,90,100)
        return 40 + Math.round((value - 24) / 2.5) * 10;
    } else if (value <= 65) {
        // 61-80: Increment by 100s (100,200,300,...)
        return 100 + Math.round((value - 35) / 5) * 100;
    } else if (value <= 85) {
        // 81-99: Increment by 1000s (1000,2000,...)
        return 1000 + Math.round((value - 66) / 5) * 1000;
    } else  {
      // 81-99: Increment by 1000s (1000,2000,...)
      return 10000 + Math.round((value - 86) / 5) * 10000;
  }
}

  const formatCitationSliderLabel = (value:number) => {
    return `${linearToExponential(value)} Citations`
  }



const Search2 = () => {
  return (
    <div className="absolute left-0 right-0 flex flex-col justify-between">
   <div className="">
      <div className="absolute left-0 right-0 flex flex-col text-center items-center justify-between">
         <div className="flex w-3/5 items-center space-x-2 ">
            <a className="text-stone-500 w-36 hover:underline" href="/research-beta">ReSearch Beta</a>
            {/* Random Placeholder Input for Keywords */}
            <RandomPlaceholderInput
            value={currentQuery||""}
            onChange={(e) => setCurrentQuery(e.target.value)}
            />
            <button onClick={handleSearch}><SearchIcon/></button>
         </div>
         <div className=" px-6 h-14 w-full flex flex-row items-center align-middle justify-center">
            <div className="flex flex-wrap gap-2">
               <div className="relative px-2 hover:text-gray-500 text-center align-middle text-xs">
                  <button className="text-2xl">
                     <Dialog>
                        <DialogTrigger>+</DialogTrigger>
                        <DialogContent className="-mt-16 pb-10">
                           <DialogHeader className="text-3xl font-semibold">Filters</DialogHeader>
                           <div className="relative">
                               //Make this the relative parent 
                              {filters.map((filter, index) => (
                                <div key={index} className="group flex flex-row justify-between items-center align-middle -my-2">
                                    //Filter Selection 
                                   <div className="justify-start flex flex-row">
                                      <DropdownMenu>
                                         <DropdownMenuTrigger className="pr-5 ml-6 text-lg rounded-md pl-2 max-w-1/4 hover:bg-stone-100 font-semibold flex flex-row items-center">
                                            {filter.selectedOption} // Display the selected option for this filter 
                                            <svg
                                               className="w-6 h-6 ml-2 -mr-1  "
                                               xmlns="http://www.w3.org/2000/svg"
                                               viewBox="0 0 24 24"
                                               width="0.5em"
                                               height="0.5em"
                                               fill="#a8a29e"
                                               >
                                               <path d="M16.293 9.293L12 13.586L7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
                                            </svg>
                                         </DropdownMenuTrigger>
                                         <DropdownMenuContent className="w-56">
                                            {options.map((option, idx) => (
                                            <DropdownMenuItem className="text-lg"
                                               key={idx}
                                               onClick={() => handleOptionSelect(index, option)} // Set the selected option on click
                                               >
                                               {option}
                                            </DropdownMenuItem>
                                            ))}
                                         </DropdownMenuContent>
                                      </DropdownMenu>
                                      <div className="w-2/4 m-1 my-2 ml-5 text-lg flex flex-row">
                                         <textarea
                                         placeholder="Enter filter text"
                                         value={filter.text} // Bind to the filter's text
                                         rows={1}
                                         className="border-none bg-transparent outline-none text-stone-800 placeholder-stone-400 w-3/4 resize-none overflow-y-auto"
                                         onChange={(e) => handleTextChange(index, e.target.value)} // Update the filter text on change
                                         onInput={(e) => {
                                         const target = e.target as HTMLTextAreaElement;
                                         target.style.height = ''; // Reset height to auto-adjust
                                         target.style.height = `${target.scrollHeight}px`; // Set height to scrollHeight
                                         }}
                                         ></textarea>
                                      </div>
                                   </div>
                                   // Remove Filter Icon
                                   <div 
                                      onClick={() =>
                                      removeFilter(index)} // Call removeFilter on SVG click
                                      className="opacity-0 group-hover:opacity-100 hover:bg-stone-100 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer"
                                      >
                                      <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M5 5L19 19M5 19L19 5" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                   </div>
                                </div>
                                ))}
                                /// Button to add new filters 
                                <div className={`absolute left-0 bottom-0 transform ${filters.length === 0 ? 'translate-y-4' : 'mb-0.5'} -translate-x-1`}> //// Conditional margin-top 
                    <button
                       onClick={addFilter}
                       className="hover:bg-stone-100 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer"
                       >
                    <svg
                       width="15px"
                       height="15px"
                       viewBox="0 0 24 24"
                       fill="none"
                       xmlns="http://www.w3.org/2000/svg"
                       transform="rotate(45)"
                       >
                    <path
                       d="M5 5L19 19M5 19L19 5"
                       stroke="#a8a29e"
                       strokeWidth="2.5"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       />
                    </svg>
                    </button>
                    </div>
                 </div>
                 </DialogContent>
                 </Dialog>
                 </button>
              </div>
              //// Display Active Filters 
              {filters.map((filter, index) => (
              // Check if filter.text is not empty before rendering the button
              filter.text && (
              <div key={index} className="relative">
                 <button
                 className={`px-4 py-2 border-2 rounded-3xl hover:bg-gray-50 active:bg-gray-200 focus:outline-none text-sm ${filter.enabled ? 'text-black' : 'text-gray-400'}`} // Conditional text color
                 onClick={() => toggleFilter(index)} // Call the toggle function on click
                 >
                 {filter.text}
                 </button>
              </div>
              )
              ))}
           </div>
           <div className="w-2/5"></div>
        </div>
         
</div>
<div className="mb-2 mt-16 w-11/12"></div>
<div  className="flex flex-row w-full  border-y my-5 mt-24  justify-center min-h-svh">
<div className="w-3/12 p-2 py-5 h-11/12 flex flex-col">
{/* Content */}
</div>
{/* Search Bar and Results Section */}
<div className=" flex flex-col justify-between w-6/12 pt-6 ">
  <div>
    <div className="flex flex-row text-xl  w-full overflow-scroll no-scrollbar  border-stone-200 border-x-2 p-2">
     
      <div className="flex flex-row text-xl  w-full overflow-scroll no-scrollbar">
      <div className="px-4">All</div>
      <div className="px-4">Articles</div>
      <div className="px-4">Organizations</div>
      <div className="px-4">Areas</div>
      <div className="px-4">Topics</div>
      <div className="px-4">Authors</div>
      <div className="px-4">Models</div>
      <div className="px-4">Datasets</div>
      <div className="px-4">Applications</div>
      <div className="px-4">Metrics</div>
      <div className="px-4">Datatype</div>
      <div className="px-4">Algorithms</div>
      </div>
      
    </div>
  </div>
  <div className="h-full align-top justify-start">
    {(searchMade && !searchDone ) && (
      <LoadingSearch/>
    )}
    {(searchDone) && (
      <GeneralColumn items={searchResults} />
    )}
  </div>
  <div className="p-5 pb-0">
    <Pagination className="">
      <PaginationContent>
        <PaginationItem>
        <PaginationPrevious href="#" />
        </PaginationItem>
        {/* Add pagination links as needed */}
        <PaginationItem>
        <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
        <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
        <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
        <PaginationEllipsis />
        </PaginationItem>
      <PaginationNext href="#" />
      </PaginationContent>
    </Pagination>
  </div>
</div>
{/* Filter Section */}
<div className="pt-6 pb-2  h-11/12 flex flex-col px-8 w-3/12">
  <div className="w-full ">
      <div className="flex flex-row text-xl  w-full overflow-scroll no-scrollbar  border-stone-200 border-x-2 p-2 mb-6">
      <div className="px-2 text-stone-500">Order</div>
      <div className="px-2">Relevance</div>
      <div className="px-2">Latest</div>
      <div className="px-2">Citations</div>
    </div>
    <div className="mb-6">
      <TwoSlider
        minStepsBetweenThumbs={1}
        max={100} // Max slider value (right side for present day)
        min={1} // Min slider value (left side for 1990)
        step={1}
        formatLabel={(value) => `${formatSliderLabel(100 - value)}`} // Inverted value to have latest date on the right
      />
    </div>
      <TwoSlider
        minStepsBetweenThumbs={1}
        max={100} // Max slider value (right side for present day)
        min={1} // Min slider value (left side for 1990)
        step={1}
        formatLabel={(value) => `${formatCitationSliderLabel(value)}`} // Inverted value to have latest date on the right
      />
  </div>
</div>
</div>
</div>
  <footer className="w-full ">
    <nav className="flex align-middle items-center justify-center p-4 flex-row">
        <p className="text-base text-stone-600 mb-3 mx-5">© 2024 Syntony, Inc.</p>
        <Link className="text-base text-stone-600 mb-3 mx-5 hover:underline" to="/privacy-policy">
          Privacy Policy
        </Link>
        <Link className="text-base text-stone-600 mb-3 mx-5 hover:underline" to="/terms-of-service">
          Terms of Service
        </Link>
    </nav>
  </footer>
</div>
  )
}

export default Search2
