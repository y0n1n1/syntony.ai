
import { useAuth } from "@/api/authContext"
import { getHistoryByUserId } from "@/api/searchAPI"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HistoryIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function formatTimestamp(date: string): string {
  if (date==="") {
      return ""
  }
  const ndate = new Date(date)     
  return ndate.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour12: false, // Use true for 12-hour format
  });
}
function formatTimestamp2(date: string): string {
  if (date==="") {
      return ""
  }
  const ndate = new Date(date)     
  return ndate.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    hour12: false, // Use true for 12-hour format
  });
}

type SearchQuery = {
  query:string,
  user_id:string,
  min_citations?: string,
  max_citations?: string,
  start_date?: string,
  end_date?: string,
  include?:string[],
  rankBy:string[],
  time_of_query:string
};



const History = () => {
  document.title = "History"
  const [hist, setHist] = useState<SearchQuery[]>([]);
  const { user } = useAuth(); // Assuming `useAuth` provides the authenticated user

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user || !user.id) {
        console.error('User not authenticated');
        return; // Prevent fetching if user is not authenticated
      }

      try {
        console.log("TRYING");
        const some_h = await getHistoryByUserId({ user_id: user.id });
        setHist(some_h.reverse()); // Update state, which will trigger a re-render
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchFolders();
  }, [user]); // Run this effect when `user` changes

  const [clickedRow, setClickedRow] = useState<number | null>(null);
  return (
    <div className="flex flex-col justify-start items-center">
      {/* Header */}
      <div className="absolute left-0 right-0">
          <div className="text-5xl ml-80 mt-16 font-light">Search History</div>
      </div>
      <div className="mb-2 mt-32 border-b-2 w-11/12"></div>
      <div className="mb-10">
      <Table className="w-[1000px] mt-5">
        <div className=" border-2 rounded-3xl">
        <TableHeader>
          <TableRow className="h-16 hover:bg-transparent">
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-2xl mt-5 font-normal text-stone-800 w-[700px]">Query</TableHead>
            <TableHead className="text-2xl mt-5 font-normal text-stone-800 w-[270px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
      {hist.map((search_q, index) => (
        <TableRow
          key={index}
          onClick={() => setClickedRow(clickedRow === index ? null : index)} // Toggle clicked row
        >
          <TableCell className="font-medium">
            <HistoryIcon />
          </TableCell>

          <TableCell className="text-2xl font-normal text-black">
            <div className="flex flex-row">
            {search_q.query}
            <div className="flex flex-row ml-2">
              {(search_q.rankBy)
                ? search_q.rankBy.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl"
                    >
                      {item}
                    </div>
                  ))
                : <div></div>}
            </div>

            <div className="flex flex-row ml-2">
              {(search_q.include)
                ? search_q.include.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl"
                    >
                      {item}
                    </div>
                  ))
                : <div></div>}
            </div>
            </div>

            {clickedRow === index && (
              <div className="flex flex-col items-left">
                <div className="flex flex-row ml-2 items-center mb-1">
                  <div className="text-stone-500 text-lg">Order:</div>
                  {
                    search_q.rankBy ? search_q.rankBy.map((item, idx) =>
                      <div
                        key={idx}
                        className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl"
                      >
                        {item}
                      </div>
                    ) : (
                      <div className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl">
                        Default
                      </div>
                    )
                  }
                </div>
                <div className="flex flex-row ml-2 items-center mb-1">
                  <div className="text-stone-500 text-lg">Include:</div>
                  {
                    search_q.include ? search_q.include.map((item, idx) =>
                      <div
                        key={idx}
                        className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl"
                      >
                        {item}
                      </div>
                    ) : (
                      <div className="px-4 p-2 cursor-pointer border mx-1 text-sm border-stone-200 shadow-sm bg-stone-50 rounded-xl">
                        All
                      </div>
                    )
                  }
                </div>
                <div className="flex flex-row items-center">
                  <div className="text-stone-500 text-lg flex flex-row">Date Range</div>
                  <div className="text-lg pl-1 text-black">
                    {search_q.start_date ? formatTimestamp2(search_q.start_date) + " - " : " - "}
                    {search_q.end_date ? formatTimestamp2(search_q.end_date) : ""}
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="text-stone-500 text-lg flex flex-row">Citation Range</div>
                  <div className="text-lg pl-1 text-black">
                    {search_q.start_date ? (search_q.min_citations) + " - " : " - "}
                    {search_q.end_date ? (search_q.max_citations) : ""}
                  </div>
                </div>
              </div>
            )}
          </TableCell>

          <TableCell className="text-lg text-stone-600 font-normal">
            {formatTimestamp(search_q.time_of_query)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
        </div>
        
      </Table>
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

export default History