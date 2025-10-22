import { useState, useEffect } from "react";
import { PremetaSearchCriteria, searchGeneral } from "./../../api/searchAPI";
import RandomPlaceholderInput from "@/components/custom/RandomPlaceholderInput";
import { format, subYears } from "date-fns"; 

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearch } from "../searchProvider";
import { useAuth } from "@/api/authContext";
import { TwoSlider } from "@/components/ui/MultiSlider";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSearch from "@/components/shared/LoadingSearch";
import GeneralColumn from "@/components/shared/GeneralColumn";
import { ChevronLeft, ChevronRight, SearchIcon, X } from "lucide-react"

const presentDate = new Date(); // Present day
const startDate = subYears(presentDate, presentDate.getFullYear() - 1989.9); // Start at 1990

// Slider min/max
const logMin = 1; // Min for logarithmic scale
const logMax = 100; // Max slider value (for 100 intervals)

// Convert a date back to a linear slider value
const logDateToLinear = (inputDateString: string | null, position: number | null | undefined): number => {
  // Handle null or undefined input for position
  if (position === 0) {
    return 100; // Return 100 if position is 0
  } else if (position === 1) {
    return 1; // Return 1 if position is 1
  }

  // Handle null or undefined inputDateString
  if (!inputDateString) {
    throw new Error("Invalid date string provided");
  }

  // Parse the input date string into a Date object
  const inputDate = new Date(inputDateString);
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date string provided");
  }

  // Flip the date back to its original position
  const midpointTime = (startDate.getTime() + presentDate.getTime()) / 2;
  const midpointDate = new Date(midpointTime);
  const flippedTime = 2 * midpointDate.getTime() - inputDate.getTime();
  const originalDate = new Date(flippedTime);

  // Calculate the proportion of the time offset
  const timeDifference = presentDate.getTime() - startDate.getTime();
  const timeOffset = presentDate.getTime() - originalDate.getTime();
  const proportion = timeOffset / timeDifference;

  // Map the proportion back to the logarithmic scale
  const logValue = proportion * (Math.log10(logMax) - Math.log10(logMin)) + Math.log10(logMin);

  // Convert the logarithmic value back to a linear slider value
  const sliderValue = Math.pow(10, logValue) - logMin;

  return sliderValue;
};


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

function linearToExponential(value: number): number | string {
  if (value === 100) return "∞";
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

const removeEmptyStrings = (list: string[]): string[] | undefined => {
  // Remove empty strings or strings with only spaces
  const cleanedList = list.filter(item => item.trim() !== '');

  // If the cleaned list is empty, return undefined
  return cleanedList.length === 0 ? undefined : cleanedList;
};

const formatCitationSliderLabel = (value:number) => {
  return `${linearToExponential(value)} Citations`
}

function exponentialToLinear(value: string): number {
  // Handle special cases
  if (value === "∞ Citations") return 100;

  // Extract the numerical part from the string
  const match = value.match(/^(\d+) Citations$/);
  if (!match) throw new Error("Invalid value format");

  const numericalValue = parseInt(match[1], 10);

  if (numericalValue <= 20) {
    // 0-20: Increment by 1s (0,1,2,...,20)
    return numericalValue + 1;
  } else if (numericalValue <= 40) {
    // 21-40: Increment by 5s (25,30,35,40)
    return 21 + (numericalValue - 20) / 5;
  } else if (numericalValue <= 100) {
    // 41-60: Increment by 10s (50,60,70,...,100)
    return 25 + (numericalValue - 40) / 10 * 2.5;
  } else if (numericalValue <= 1000) {
    // 61-80: Increment by 100s (100,200,...,1000)
    return 35 + (numericalValue - 100) / 100 * 5;
  } else if (numericalValue <= 10000) {
    // 81-99: Increment by 1000s (1000,2000,...,10000)
    return 65 + (numericalValue - 1000) / 1000 * 5;
  } else if (numericalValue > 10000) {
    // 10000 and beyond: Increment by 10000s (10000,20000,...)
    return 85 + (numericalValue - 10000) / 10000 * 5;
  }

  throw new Error("Invalid value");
}



type InputItem = {
  article_id: string;
  [key: string]: any;  // This allows any additional fields besides article_id
};

type OutputItem = {
  article_id: string;
  topics: { [key: string]: any }[];  // Collecting all non-article_id fields in an array of objects
};

function groupTopicsByArticleId(inputList: InputItem[]): OutputItem[] {
  const resultMap: { [key: string]: OutputItem } = {};

  inputList.forEach(item => {
    const { article_id, ...topicData } = item; // Destructure article_id and collect the rest as topicData

    if (!resultMap[article_id]) {
      // If the article_id is not in the resultMap, add it
      resultMap[article_id] = { article_id, topics: [] };
    }
    
    // Push the topic data to the corresponding article_id's topics array
    resultMap[article_id].topics.push(topicData);
  });

  // Return the values of the resultMap as an array
  return Object.values(resultMap);
}







import { searchTopicSolely } from "@/api/searchAPI";
import { useRef } from "react";

type ConversionMap = {
  [key: string]: string;
};

const mapping: ConversionMap = {
  used_algorithms: "Algorithm",
  taxonomy_learning_type: "Learning method",
  taxonomy_experiment_type: "Experiment type",
  taxonomy_areas: "Area",
  tasks_list_of_tasks: "Task",
  modalities: "Modality",
  mod_known_models_used: "Model",
  mod_evaluation_metrics_for_models: "Metric",
  expdet_training_frameworks: "Training framework",
  expdet_hardware: "Hardware",
  deep_learning_techniques_used: "Technique",
  data_type: "Data type",
  taxonomy_topics: "Topic",
  data_datasets_used: "Dataset",
  by_institutions: "Institution",
  application_domain: "Application",
};

function TopicTypeConvert(input: string): string {
  return mapping[input] || input;
}

const colorMap: Record<string, string> = {
  expdet_hardware: "text-black border-black-200 hover:bg-black-100",
  expdet_training_frameworks: "text-black border-black-200 hover:bg-black-100",
  taxonomy_learning_type: "text-red-500 border-red-200 hover:bg-red-100",
  by_institutions: "text-orange-500 border-orange-200 hover:bg-orange-100",
  taxonomy_areas: "text-yellow-500 border-yellow-200 hover:bg-yellow-100",
  taxonomy_topics: "text-lime-500 border-lime-200 hover:bg-lime-100",
  taxonomy_experiment_type: "text-green-500 border-green-200 hover:bg-green-100",
  mod_known_models_used: "text-teal-500 border-teal-200 hover:bg-teal-100",
  data_datasets_used: "text-blue-500 border-blue-200 hover:bg-blue-100",
  application_domain: "text-purple-500 border-purple-200 hover:bg-purple-100",
  mod_evaluation_metrics_for_models: "text-fuchsia-500 border-fuchsia-200 hover:bg-fuchsia-100",
  data_type: "text-pink-500 border-pink-200 hover:bg-pink-100",
  modalities: "text-pink-500 border-pink-200 hover:bg-pink-100",
  used_algorithms: "text-slate-500 border-slate-200 hover:bg-slate-100",
  deep_learning_techniques_used: "text-slate-500 border-slate-200 hover:bg-slate-100",
  tasks_list_of_tasks: "text-slate-500 border-slate-200 hover:bg-slate-100",
};

const colorMapx: Record<string, string> = {
  expdet_hardware: "text-black border-black-200 bg-black-100",
  expdet_training_frameworks: "text-black border-black-200 bg-black-100",
  taxonomy_learning_type: "text-red-500 border-red-200 bg-red-100",
  by_institutions: "text-orange-500 border-orange-200 bg-orange-100",
  taxonomy_areas: "text-yellow-500 border-yellow-200 bg-yellow-100",
  taxonomy_topics: "text-lime-500 border-lime-200 bg-lime-100",
  taxonomy_experiment_type: "text-green-500 border-green-200 bg-green-100",
  mod_known_models_used: "text-teal-500 border-teal-200 bg-teal-100",
  data_datasets_used: "text-blue-500 border-blue-200 bg-blue-100",
  application_domain: "text-purple-500 border-purple-200 bg-purple-100",
  mod_evaluation_metrics_for_models: "text-fuchsia-500 border-fuchsia-200 bg-fuchsia-100",
  data_type: "text-pink-500 border-pink-200 bg-pink-100",
  modalities: "text-pink-500 border-pink-200 bg-pink-100",
  used_algorithms: "text-slate-500 border-slate-200 bg-slate-100",
  deep_learning_techniques_used: "text-slate-500 border-slate-200 bg-slate-100",
  tasks_list_of_tasks: "text-slate-500 border-slate-200 bg-slate-100",
};

const colorMapUntoggled: Record<string, string> = {
  expdet_hardware: "text-black-700 border-black-100 hover:bg-black-50",
  expdet_training_frameworks: "text-black-700 border-black-100 hover:bg-black-50",
  taxonomy_learning_type: "text-red-300 border-red-100 hover:bg-red-50",
  by_institutions: "text-orange-300 border-orange-100 hover:bg-orange-50",
  taxonomy_areas: "text-yellow-300 border-yellow-100 hover:bg-yellow-50",
  taxonomy_topics: "text-lime-300 border-lime-100 hover:bg-lime-50",
  taxonomy_experiment_type: "text-green-300 border-green-100 hover:bg-green-50",
  mod_known_models_used: "text-teal-300 border-teal-100 hover:bg-teal-50",
  data_datasets_used: "text-blue-300 border-blue-100 hover:bg-blue-50",
  application_domain: "text-purple-300 border-purple-100 hover:bg-purple-50",
  mod_evaluation_metrics_for_models: "text-fuchsia-300 border-fuchsia-100 hover:bg-fuchsia-50",
  data_type: "text-pink-300 border-pink-100 hover:bg-pink-50",
  modalities: "text-pink-300 border-pink-100 hover:bg-pink-50",
  used_algorithms: "text-slate-300 border-slate-100 hover:bg-slate-50",
  deep_learning_techniques_used: "text-slate-300 border-slate-100 hover:bg-slate-50",
  tasks_list_of_tasks: "text-slate-300 border-slate-100 hover:bg-slate-50",
};

const colorMapxUntoggled: Record<string, string> = {
  expdet_hardware: "text-black-700 border-black-100 bg-black-50",
  expdet_training_frameworks: "text-black-700 border-black-100 bg-black-50",
  taxonomy_learning_type: "text-red-300 border-red-100 bg-red-50",
  by_institutions: "text-orange-300 border-orange-100 bg-orange-50",
  taxonomy_areas: "text-yellow-300 border-yellow-100 bg-yellow-50",
  taxonomy_topics: "text-lime-300 border-lime-100 bg-lime-50",
  taxonomy_experiment_type: "text-green-300 border-green-100 bg-green-50",
  mod_known_models_used: "text-teal-300 border-teal-100 bg-teal-50",
  data_datasets_used: "text-blue-300 border-blue-100 bg-blue-50",
  application_domain: "text-purple-300 border-purple-100 bg-purple-50",
  mod_evaluation_metrics_for_models: "text-fuchsia-300 border-fuchsia-100 bg-fuchsia-50",
  data_type: "text-pink-300 border-pink-100 bg-pink-50",
  modalities: "text-pink-300 border-pink-100 bg-pink-50",
  used_algorithms: "text-slate-300 border-slate-100 bg-slate-50",
  deep_learning_techniques_used: "text-slate-300 border-slate-100 bg-slate-50",
  tasks_list_of_tasks: "text-slate-300 border-slate-100 bg-slate-50",
};






{/*
  Take into account the selectedItems stuff
  display the meta data stuff
  add more properties for filtering and what not clicking and stuff
  statistics even...
  
  
  
  */}










const Search = () => {
  const { searchInput } = useSearch();
  const params = new URLSearchParams(window.location.search);
  const qFromURL = params.get("q");
  const [tempQ, setTempQ] = useState(searchInput||qFromURL||"")
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [ searchResult, setSearchResult ] = useState([]);
  const [searchMade, setSearchMade] = useState(false);  // New state to track search initiation
  const [searchDone, setSearchDone] = useState(false);  // New state to track search initiation

  const [searchParams, setSearchParams] = useSearchParams({
    q:(searchInput||qFromURL||""),
    tq:params.get("tq")||"",
    selectedItems:params.get("selectedItems")||[],
    startDate:params.get("startDate")||"",
    endDate:params.get("endDate")||"",
    minCitations:params.get("minCitations")||"",
    maxCitations:params.get("maxCitations")||"",
    include:params.get("include")||[],
    rankBy:params.get("rankBy")||[]
  })

  // ALL WAYS TO SEARCH!
  const handleSubmit = async () => {
    if(tempQ){
      setSearchParams(prev => {
        prev.set("q", tempQ)
        return prev
      })
    }
    if(searchParams.get("q")){
      document.title = searchParams.get("q")||"Search"
      setSearchDone(false)
      setSearchMade(true);  // Set to true when search is initiated
      const includeParam = searchParams.get('include') || "";
      const includeValue = includeParam.split(',');
      const filtersParam = searchParams.get('filters') || "";
      const filtersValue = filtersParam.split(',');
      const rankByParam = searchParams.get('rankBy') || "";
      const rankByValue = rankByParam.split(',');
      const searchTo:PremetaSearchCriteria= {
        minCitations: searchParams.get("minCitations")||undefined,
        maxCitations: searchParams.get("maxCitations")||undefined,
        startDate: searchParams.get("startDate")||undefined,
        endDate: searchParams.get("endDate")||undefined,
        query: searchParams.get("q")||"a",
        include: removeEmptyStrings(includeValue) || undefined,
        filters: removeEmptyStrings(filtersValue) || undefined,
        rankBy: removeEmptyStrings(rankByValue) || []
        
      }
      try {
        const updatedResults = await searchGeneral(userId, 20, 1, searchTo)
        console.log(updatedResults)
  
        setSearchResult(updatedResults)
        setSearchDone(true);  // Set to true when search is initiated
        setSearchMade(false);  // Set to true when search is initiated from home
      } catch (error) {
        console.error("Error searching articles:", error);
      }
    }
  };

  // start from link GENERALIZE THIS FOR ALL ITEMS!!
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params)
    handleSubmit()
  }, []);
  










    // FILTERS:
    const [res, setRes] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false); // Track focus state
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
    const searchBoxRef = useRef<HTMLInputElement>(null); // Ref for search box
    const topicQueryFromUrl = searchParams.get("tq") || "";
  
    useEffect(() => {
      const fetchResults = async () => {
        const query = searchParams.get("tq") || "";
        const ans = await searchTopicSolely(query);
        setRes(ans);
      };
  
      fetchResults();
    }, [searchParams.get("tq")]);
  
    useEffect(() => {
      const savedItems = searchParams.get("selectedItems");
      if (savedItems) {
        setSelectedItems(JSON.parse(savedItems));
      }
    }, [searchParams]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchParams((prevParams) => {
        const newParams = { ...Object.fromEntries(prevParams.entries()), tq: newQuery };
        return newParams;
      });
    };
  
    const handleItemClick = (item: any) => {
      // Check if the item with the same "id" already exists in selectedItems
      const itemWithActivation = { ...item, activated: true };
      const isItemSelected = selectedItems.some((selectedItem) => selectedItem["id"] === item["id"]);
      
      if (!isItemSelected) {
        const updatedItems = [...selectedItems, itemWithActivation];
        setSelectedItems(updatedItems);
    
        setSearchParams({
          tq: searchParams.get("tq") || "",
          selectedItems: JSON.stringify(updatedItems),
        });
      }
    };
    
  
    const handleItemXClick = (item: any) => {
      
      const updatedItems = selectedItems.filter(it => (it["id"] !== item["id"]));
      
    
      setSelectedItems(updatedItems);
    
      setSearchParams({
        tq: searchParams.get("tq") || "",
        selectedItems: JSON.stringify(updatedItems),
      });
    };
    const handleItemToggleClick = (x: any) => {
      // Update the selectedItems array by toggling the "activated" property of the item with the matching "id"
      const updatedItems = selectedItems.map((item) => 
        item["id"] === x["id"] 
          ? { ...item, activated: !item["activated"] }  // Toggle the "activated" property
          : item  // Keep the other items unchanged
      );
    
      setSelectedItems(updatedItems);
      console.log(selectedItems)
    
      setSearchParams({
        tq: searchParams.get("tq") || "",
        selectedItems: JSON.stringify(updatedItems),
      });
    };
    
    
  
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      // Check if the related target (element losing focus) is inside the dropdown
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.relatedTarget as Node)
      ) {
        return;
      }
      setIsFocused(false);
    };
  
    const handleFocus = () => {
      setIsFocused(true);
    };
  
    const handleDropdownMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent blur when clicking inside dropdown
      e.preventDefault();
    };
  



  // RANGE CONSTRAINTS
  const dateRangeValues = [
    logDateToLinear(searchParams?.get("startDate"), 1)|| 100,
    logDateToLinear(searchParams?.get("endDate"), 0) || 1,
  ];
  const handleDateRangeValuesChange =  (newValues: number[]) => {
      setSearchParams((prevParams) => {
        const newParams = { ...Object.fromEntries(prevParams.entries()), startDate: formatSliderLabel(newValues[0]), endDate: formatSliderLabel(newValues[1]) };
        return newParams;
      });
  }
  const citationRangeValues = [
    exponentialToLinear(searchParams?.get("minCitations")||"0 Citations")|| 1,
    exponentialToLinear(searchParams?.get("maxCitations")||"∞ Citations") || 100,
  ];
  const handleCitationRangeValuesChange =  (newValues: number[]) => {
    setSearchParams((prevParams) => {
      const newParams = { ...Object.fromEntries(prevParams.entries()), minCitations: formatCitationSliderLabel(newValues[0]), maxCitations: formatCitationSliderLabel(newValues[1]) };
      return newParams;
    });
  }





  const updateRankBySearchParams = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const rankBy = params.get("rankBy")?.split(",") || [];

    if (rankBy.includes(param)) {
      // Remove the item if it exists
      const updatedRankBy = rankBy.filter((item) => item !== param);
      params.set("rankBy", updatedRankBy.join(","));
    } else {
      // Add the item if it doesn't exist
      rankBy.push(param);
      params.set("rankBy", rankBy.join(","));
    }

    // Clean up empty `rankBy`
    if (params.get("rankBy") === "") {
      params.delete("rankBy");
    }
    setSearchParams(new URLSearchParams(params));
  }

    const isActive = (param: string) => {
      const rankBy = searchParams.get("rankBy")?.split(",") || [];
      return rankBy.includes(param);
    };









    // include
     // Helper function to update search params
  const updateIncludeSearchParams = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let includeList = params.get("include")?.split(",") || [];

    if (includeList.includes(param)) {
      // Remove the item if it exists
      const updatedIncludeList = includeList.filter((item) => item !== param);
      params.set("include", updatedIncludeList.join(","));
    } else {
      // Add the item if it doesn't exist
      includeList.push(param);
      params.set("include", includeList.join(","));
      if (param!=="All"){
        includeList = includeList.filter(item => item !== "All");
        params.set("include", includeList.join(","));
      }
      if (param==="All"){
        includeList = includeList.filter(item => item === "All");
        params.set("include", includeList.join(","));
      }
    }

    // Clean up empty `include`
    if (params.get("include") === "") {
      params.delete("include");
    }

    setSearchParams(new URLSearchParams(params));
  };

  // Check if a specific filter is active
  const isIncludeActive = (param: string) => {
    const includeList = searchParams.get("include")?.split(",") || [];
    return includeList.includes(param);
  };
  return (
<div className="absolute left-0 right-0 flex flex-col justify-between">
   <div className="">
      <div className="absolute left-0 right-0 flex flex-col text-center items-center justify-between">
         <div className="flex w-3/5 items-center space-x-2">
            <a className="text-stone-500 text-lg w-36 hover:underline" href="/research-beta">ReSearch Beta</a>
            {/* Random Placeholder Input for Keywords */}
            <div className="w-full" onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}><RandomPlaceholderInput
            value={tempQ||""}
            /* onChange={(e) => setFormValues({ ...formValues, titlesIncludes: e.target.value })} */
            onChange={(e) => setTempQ(e.target.value)}
            
             
            /></div>
            <button  onClick={handleSubmit}><SearchIcon className="z-50 -ml-12 "/></button>
         </div>
         

         
</div>
<div  className="flex flex-row w-full  border-y my-5 mt-20  justify-center min-h-svh">
<div className="w-3/12 p-2 py-5 h-11/12 flex flex-col">
{/* Content */}
</div>
{/* Search Bar and Results Section */}
<div className=" flex flex-col justify-between w-6/12 pt-3 ">
            
  <div>
    <div className="flex flex-row text-xl  w-full overflow-scroll no-scrollbar p-2">
     
    <div className="flex flex-row text-xl w-full overflow-scroll no-scrollbar p-2 pt-0 ">
      <ChevronRight className="mt-2 h-8"/>
    <div className="flex flex-row text-xl w-full overflow-scroll no-scrollbar">
  {/* Active Items First */}
  {[
    "All", "Articles", "Organizations", "Areas", "Topics", "Authors", 
    "Models", "Datasets", "Applications", "Metrics", "Datatype", "Algorithms"
  ]
    .filter(item => isIncludeActive(item))  // Filter active items
    .map(item => {
      return (
        <div
          key={item}
          className={`px-4 p-2 cursor-pointer border mx-1 border-stone-200 shadow-sm bg-stone-50 rounded-xl`}
          onClick={() => updateIncludeSearchParams(item)}
        >
          {item}
        </div>
      );
    })
  }

  {/* Inactive Items */}
  {[
    "All", "Articles", "Organizations", "Areas", "Topics", "Authors", 
    "Models", "Datasets", "Applications", "Metrics", "Datatype", "Algorithms"
  ]
    .filter(item => !isIncludeActive(item))  // Filter inactive items
    .map(item => {
      return (
        <div
          key={item}
          className={`px-4 p-2 cursor-pointer border mx-1 border-white`}
          onClick={() => updateIncludeSearchParams(item)}
        >
          {item}
        </div>
      );
    })
  }
</div>
<ChevronLeft className="mt-2 h-8"/>


      </div>
      
    </div>
  </div>
  
  <div className="h-full align-top justify-start">









    {(searchMade && !searchDone ) && (
      <LoadingSearch/>
    )}
    {(searchDone) && (
      <GeneralColumn items={searchResult} />
    )}
  </div>
  <div className="p-5 pb-0">
    {/*
    <Pagination className="mb-6">
      <PaginationContent>
        <PaginationItem>
        <PaginationPrevious href="#" />
        </PaginationItem>
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
    */}
  </div>
</div>
{/* Filter Section */}
<div className="pt-3 pb-2  h-11/12 flex flex-col px-8 w-3/12">
  <div className="w-full">
      <div className="flex flex-row  text-xl  w-full   -mx-4 p-2 mb-6">
      <div className="p-2 mx-1  text-stone-500">Order</div>
      <div className={`p-2 cursor-pointer border mx-1 ${isActive("Relevance") ? " border-stone-200 shadow-sm bg-stone-50 rounded-xl ":"border-white"}`}
      onClick={() => 
        updateRankBySearchParams("Relevance")
      }
      style={{ display: "inline-block" }}>Relevance</div>
      <div className={`p-2 cursor-pointer border mx-1 ${isActive("Latest") ? "border border-stone-200 shadow-sm bg-stone-50 rounded-xl ":"border-white"}`}
      onClick={() => 
        updateRankBySearchParams("Latest")
      }
      style={{ display: "inline-block" }}>Latest</div>
      {/*
      <div className={`p-2 cursor-pointer border mx-1 ${isActive("Citations") ? "border border-stone-200 shadow-sm bg-stone-50 rounded-xl ":"border-white"}`}
      onClick={() => 
        updateRankBySearchParams("Citations")
      }
      style={{ display: "inline-block" }}>Citations</div>
      */}
    </div>
    <div className="mb-6">
      <TwoSlider
        minStepsBetweenThumbs={1}
        max={100} // Max slider value (right side for present day)
        min={1} // Min slider value (left side for 1990)
        step={1}
        value={dateRangeValues}
        onValueChange={handleDateRangeValuesChange}
        formatLabel={(value) => `${formatSliderLabel(value)}`} // Inverted value to have latest date on the right
      />
    </div>
      <TwoSlider
        minStepsBetweenThumbs={1}
        max={100} // Max slider value (right side for present day)
        min={1} // Min slider value (left side for 1990)
        step={1}
        value={citationRangeValues}
        onValueChange={handleCitationRangeValuesChange}
        formatLabel={(value) => `${formatCitationSliderLabel(value)}`} // Inverted value to have latest date on the right
      />
  </div>

  <div className="hidden w-full  flex-row mt-6 items-center ">
        <div
          onBlur={handleBlur}
          onFocus={handleFocus}
          tabIndex={-1} // Make the parent div focusable 
          className="z-50 w-full"
        >
          <div
            className={`border bg-white p-3 rounded-3xl z-50 w-full justify-start  items-start align-top flex flex-row ${
              isFocused && res.length > 0
                ? "border-stone-200  text-stone-200 rounded-b-none border-b-0"
                : "border-stone-200 text-stone-200 "
            }`}
          >
            <input
              ref={searchBoxRef} // Assign ref to the input
              type="text"
              placeholder="Search Filters"
              className=" focus:outline-none z-50 placeholder-stone-400 w-full bg-white text-stone-800"
              value={topicQueryFromUrl} // Set the value of the input to the query in the URL
              onChange={handleInputChange}
            />
          </div>
          <div
            className={`px-2 pb-2 ${
              isFocused && res.length > 0 ? "" : "hidden"
            } border-t-0 border border-stone-200 bg-white rounded-t-none rounded-3xl shadow-lg`}
            ref={dropdownRef}
            onMouseDown={handleDropdownMouseDown} // Prevent blur when clicking inside dropdown
          >
            {isFocused && res.length > 0 && (
              <div className="-mt-1 bg-white scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent max-h-60 overflow-y-auto z-50 w-full">
                <ul className="divide-y divide-gray-200 bg-white">
                  {res.map((item, index) => (
                    <li key={index}>
                      <div
                        className={`cursor-pointer flex justify-between items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg ${colorMap[item["topic_type"]]}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span>{item["topic"]}</span>
                        <span>{TopicTypeConvert(item["topic_type"])}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
  
        
      </div>
      <div className="hidden  flex-row mt-2 items-center">
        {/* Render selected items elsewhere */}
        <div className="flex  flex-wrap ">
            {selectedItems.map((item) => (
                <div  className={`cursor-pointer group relative items-center m-1 px-3 py-2 text-xs font-medium  border  rounded-full ${item["activated"] ? colorMap[item["topic_type"]] : colorMapUntoggled[item["topic_type"]]}`}>
                  <div className={`absolute invisible  ${item["activated"] ? colorMapx[item["topic_type"]] : colorMapxUntoggled[item["topic_type"]]}  group-hover:visible`}><X onClick={() => handleItemXClick(item)}/></div>
                  <div onClick={() => handleItemToggleClick(item)} >
                  <span>{item["topic"]}</span> -{" "}
                  <span>{TopicTypeConvert(item["topic_type"])}</span></div></div>
            ))}
        </div>
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
  );
};

export default Search;



