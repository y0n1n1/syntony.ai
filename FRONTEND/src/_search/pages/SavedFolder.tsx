import { ArrowDownAZ, ArrowDownZA, CalendarArrowDown, CalendarArrowUp, Pin, PinOff, Plus, SlidersHorizontal, Square, SquareCheck, Trash, Trash2 } from "lucide-react"
import { useEffect, useState } from "react";

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Link, useParams } from "react-router-dom";
import { getSavedFolderById } from "@/api/savedFolderAPI";

type OrderType = 'calendar' | 'alphabetical';

function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}
const joinArrayToSentence = (items: string[], maxAuthors: number = 5): string => {
  if (items.length === 0) return '';
  const displayedAuthors = items.slice(0, maxAuthors).join(', ');
  return items.length > maxAuthors ? `${displayedAuthors} ...` : displayedAuthors;
};
// Define a Folder type
interface Article {
    id: string;
    title: string;
    published_date: string;
    authors:string[],
    citationCount: number;
    isPinned: boolean;
    isSelected: boolean;
  }


  
  interface FolderItemProps {
    article: Article;
    onTogglePin: (id: string) => void;
    onToggleSelect: (id: string) => void;
  }
  
  const Article: React.FC<FolderItemProps> = ({ article, onTogglePin, onToggleSelect }) => {
    
    return (
      <div className="flex w-full flex-row p-4 py-1 pb-3 align-middle justify-between items-center">
        <div className="flex flex-row align-middle items-center">
        <div className="flex flex-row rounded-md mr-3 p-1 group w-15">
  {/* Select Checkbox */}
  <div onClick={() => onToggleSelect(article.id)} className="cursor-pointer mr-1 ">
    {article.isSelected ? <SquareCheck /> : <Square  />}
  </div>
  
  {/* Pin Icon */}
  <div onClick={() => onTogglePin(article.id)} className="relative cursor-pointer">
    {article.isPinned ? (
      <>
        <Pin className="group-hover:hidden" />
        <PinOff className="hidden group-hover:flex" />
      </>
    ) : (
      <>
        <Pin className="hidden group-hover:flex" />
      </>
    )}
  </div>
</div>

          <div className="font-semibold text-lg w-full hover:underline">
            <Link to={"/article/"+article.id}><Latex>{article.title}</Latex></Link>
          </div>
        </div>
        <div className="flex flex-row align-middle items-center  pr-12 text-base">
            <div className="text-sm w-72">{joinArrayToSentence(article.authors)}</div>
        <div className="flex flex-row align-middle items-center  justify-between  text-base">
          <div className="w-48">{formatDate(article.published_date)}</div>
          <div className="w-16">{article.citationCount} Citations</div>
        </div>

        </div>
      </div>
    );
  };

import { Folder } from "../../api/savedFolderAPI"
import { getSavedArticlesByFolderId } from "@/api/savedArticleAPI";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewArticleForm } from "@/components/custom/CreateArticleForm";
import Latex from "react-latex-next";
  
  const SavedFolder = () => {
    const { id } = useParams<{ id: string }>();

    const [folder_info, setFolderInfo] = useState<Folder | null>(null);
    useEffect(() => {
      const fetchFolderInfo = async () => {
        try {
          const folderData: Folder = await getSavedFolderById(id || "");

          document.title = folderData.title
          setFolderInfo(folderData);
        } catch (error) {
          console.error("Error fetching folder info:", error);
        }
      };
  
      fetchFolderInfo();
    }, [id]);
    interface OrderIcons {
      down: JSX.Element;
      up: JSX.Element;
    }
  
    const OrderTypes: Record<OrderType, OrderIcons> = {
      calendar: {
        down: <CalendarArrowDown />,
        up: <CalendarArrowUp />,
      },
      alphabetical: {
        down: <ArrowDownZA />,
        up: <ArrowDownAZ />,
      },
    };
  
    const [isChecked, setIsChecked] = useState(false);
    const [orderType, setOrderType] = useState<OrderType>('calendar');
    const [isAscending, setIsAscending] = useState(true);
  
    // Toggle delete option
    const handleToggle = () => setIsChecked(!isChecked);
  
    // Function to toggle order direction
    const toggleOrderDirection = () => setIsAscending(prev => !prev);
  
    // Function to handle setting order type
    const handleOrderTypeChange = (type: OrderType) => {
      setOrderType(type);
      setIsAscending(true);
    };
    
    // Local state for tracking selected and pinned status of each folder
    const [articleState, setArticleState] = useState<Article[] | null>(null);
    useEffect(() => {
      const fetchFolderInfo = async () => {
        try {
          console.log(folder_info)
          const articleData: Article[] = await getSavedArticlesByFolderId(folder_info?.folder_id||"");
          setArticleState(articleData);
        } catch (error) {
          console.error("Error fetching folder info:", error);
        }
      };
  
      fetchFolderInfo();
    }, [id, folder_info]);
    
    const { toast } = useToast()
    // Sort folders with pinned folders at the top, then by `orderType` and `isAscending`
    const sortedArticles = [...(articleState ?? []) as Article[]]
      .sort((a, b) => {
        // Prioritize pinned folders
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
  
        // Secondary sort by order type
        if (orderType === 'calendar') {
          return isAscending
            ? new Date(a.published_date).getTime() - new Date(b.published_date).getTime()
            : new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
        } else {
          return isAscending
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
  
    // Toggle selection status
    const toggleSelect = (Thisid: string) => {
      setArticleState(prevState =>
        (prevState||[]).map(article =>
          article.id === Thisid ? { ...article, isSelected: !article.isSelected } : article
        )
      );
    };
  
    // Toggle pinned status
    const togglePin = (Thatid: string) => {
      let pins = 0;
      (articleState||[]).forEach((article) => {
        if (article.isPinned) {
            pins++;
          }
      });
      const checkPin = (articleState||[]).find(article => article.id === Thatid)?.isPinned ?? false;
      if ((pins <4) || (checkPin)) {
        setArticleState(prevState =>
          (prevState||[]).map(article =>
            article.id === Thatid ? { ...article, isPinned: !article.isPinned } : article
          )
        );
      } else {
      toast({title: "Pin Limit: You can only pin 4 articles"})
      }
    };
  
    return (
      <div className="flex flex-col justify-start items-center min-w-96">
        <Toaster />
        <div className="absolute left-0 right-0">
          <div className="text-5xl ml-80 mt-16 font-light"><Link to="/saved" className="text-stone-600 hover:underline">Folders/</Link>{folder_info?.folder_name}</div>
        </div>
        <div className="mb-2 mt-32 border-b-2 w-11/12"></div>
  
        <div className="flex flex-row justify-between w-full px-16">
          <div className="flex flex-row">
            <div className="flex flex-row hover:bg-stone-100 p-1 rounded-md">
              <div onClick={handleToggle} className="cursor-pointer mr-1">
                {isChecked ? <SquareCheck /> : <Square />}
              </div>
              <div onClick={() => console.log("delete action")} className="cursor-pointer">
                {isChecked ? <Trash2 /> : <Trash />}
              </div>
            </div>
            <div className="hover:bg-stone-100 p-1  rounded-md ml-4 cursor-pointer">
            <Dialog>
                <DialogTrigger><Plus /></DialogTrigger>
                <DialogContent>
                  <NewArticleForm/>
                </DialogContent>
              </Dialog>
            </div>
          </div>
  
          <div className="flex flex-row items-center p-1 hover:bg-stone-100 cursor-pointer rounded-md">
            <div className="cursor-pointer mr-1" onClick={toggleOrderDirection}>
              {isAscending ? OrderTypes[orderType].up : OrderTypes[orderType].down}
            </div>
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SlidersHorizontal className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 m-5 p-2">
                <DropdownMenuLabel className="text-lg">Order by</DropdownMenuLabel>
  
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleOrderTypeChange('calendar')}>
                  <div className="flex flex-row justify-between w-full">
                    <div className="text-lg">Date created</div>
                    <div>{isAscending ? OrderTypes.calendar.up : OrderTypes.calendar.down}</div>
                  </div>
                </DropdownMenuItem>
  
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleOrderTypeChange('alphabetical')}>
                  <div className="flex flex-row justify-between w-full">
                    <div className="text-lg">A to Z</div>
                    <div>{isAscending ? OrderTypes.alphabetical.up : OrderTypes.alphabetical.down}</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
  
        <div className="flex flex-col w-full pl-12">
          {sortedArticles.map(article_this => (
            <Article
              key={article_this.id}
              article={article_this}
              onToggleSelect={toggleSelect}
              onTogglePin={togglePin}
            />
          ))}
        </div>
        <footer className="w-full absolute bottom-0 left-0 right-0">
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
  

export default SavedFolder