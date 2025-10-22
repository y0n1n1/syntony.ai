import { searchTopicSolely } from "@/api/searchAPI";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

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
  expdet_hardware: "text-black border-black-200",
  expdet_training_frameworks: "text-black border-black-200",
  taxonomy_learning_type: "text-red-500 border-red-200",
  by_institutions: "text-orange-500 border-orange-200",
  taxonomy_areas: "text-yellow-500 border-yellow-200",
  taxonomy_topics: "text-lime-500 border-lime-200",
  taxonomy_experiment_type: "text-green-500 border-green-200",
  mod_known_models_used: "text-teal-500 border-teal-200",
  data_datasets_used: "text-blue-500 border-blue-200",
  application_domain: "text-purple-500 border-purple-200",
  mod_evaluation_metrics_for_models: "text-fuchsia-500 border-fuchsia-200",
  data_type: "text-pink-500 border-pink-200",
  modalities: "text-pink-500 border-pink-200",
  used_algorithms: "text-slate-500 border-slate-200",
  deep_learning_techniques_used: "text-slate-500 border-slate-200",
  tasks_list_of_tasks: "text-slate-500 border-slate-200",
};


const SimpleTest: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [res, setRes] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false); // Track focus state
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
    const searchBoxRef = useRef<HTMLInputElement>(null); // Ref for search box
  
    useEffect(() => {
      const fetchResults = async () => {
        const query = searchParams.get("tq") || "";
        const ans = await searchTopicSolely(query);
        setRes(ans);
      };
  
      fetchResults();
    }, [searchParams]);
  
    useEffect(() => {
      const savedItems = searchParams.get("selectedItems");
      if (savedItems) {
        setSelectedItems(JSON.parse(savedItems));
      }
    }, [searchParams]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchParams((prevParams) => {
        const newParams = { ...Object.fromEntries(prevParams.entries()), q: newQuery };
        return newParams;
      });
    };
  
    const handleItemClick = (item: any) => {
      const updatedItems = [...selectedItems, item];
      setSelectedItems(updatedItems);
  
      setSearchParams({
        q: searchParams.get("q") || "",
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
  
    // Get the value of 'q' from the URL to set as the input's value
    const queryFromUrl = searchParams.get("tq") || "";
  
    return (
      <div className="relative w-96">
        <div
          onBlur={handleBlur}
          onFocus={handleFocus}
          tabIndex={-1} // Make the parent div focusable
        >
          <div
            className={`border-2 p-3 rounded-3xl ${
              isFocused && res.length > 0
                ? "border-stone-200 text-stone-200 rounded-b-none border-b-0"
                : "border-stone-200 text-stone-200 "
            }`}
          >
            <input
              ref={searchBoxRef} // Assign ref to the input
              type="text"
              placeholder="Search topics"
              className="w-full focus:outline-none placeholder-stone-400 text-stone-800"
              value={queryFromUrl} // Set the value of the input to the query in the URL
              onChange={handleInputChange}
            />
          </div>
          <div
            className={`px-2 pb-2 ${
              isFocused && res.length > 0 ? "" : "hidden"
            } border-t-0 border-2 border-stone-200 rounded-t-none rounded-3xl shadow-lg`}
            ref={dropdownRef}
            onMouseDown={handleDropdownMouseDown} // Prevent blur when clicking inside dropdown
          >
            {isFocused && res.length > 0 && (
              <div className="-mt-1 bg-white scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent max-h-60 overflow-y-auto z-50 w-full">
                <ul className="divide-y divide-gray-200">
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
  
        {/* Render selected items elsewhere */}
        <div className="mt-4">
          <h2>Selected Items:</h2>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index} className="py-2">
                <span>{item["topic"]}</span> -{" "}
                <span>{TopicTypeConvert(item["topic_type"])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

export default SimpleTest;
