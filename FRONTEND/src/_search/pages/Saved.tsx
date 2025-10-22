import { ArrowDownAZ, ArrowDownZA, CalendarArrowDown, CalendarArrowUp, Folder, Pin, PinOff, Plus, SlidersHorizontal, Square, SquareCheck, Trash, Trash2 } from "lucide-react"
import { useEffect, useState } from "react";

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { getSavedFoldersByUserId } from "@/api/savedFolderAPI";
import { useAuth } from "@/api/authContext";
import { NewFolderForm } from "@/components/custom/CreateFolderForm";
import { Link } from "react-router-dom";
import { addPinnedFolder, getPinnedFoldersByUserId, removePinnedFolder } from "@/api/pinnedFolderAPI";

type OrderType = 'calendar' | 'alphabetical';

type NonEmptyArray<T> = [T, ...T[]];

// Define a Folder type
export interface Folder {
    folder_name: string;
    created_at: string;
    folder_id: string;
    article_count: number;
    isPinned: boolean;
    isSelected: boolean;
  }
  
  interface FolderItemProps {
    folder: Folder;
    onTogglePin: (id: string) => void;
    onToggleSelect: (id: string) => void;
  }
  
  function formatDate(isoString: string): string {
    const date = new Date(isoString);
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  
    return date.toLocaleDateString('en-US', options);
  }

  const FolderItem: React.FC<FolderItemProps> = ({ folder, onTogglePin, onToggleSelect }) => {
    
    return (
      <div className="flex w-full flex-row p-4 py-2 align-middle justify-between items-center">
        <div className="flex flex-row align-middle items-center">
        <div className="flex flex-row rounded-md mr-3 p-1 group w-15">
  {/* Select Checkbox */}
  <div onClick={() => onToggleSelect(folder.folder_id)} className="cursor-pointer mr-1 ">
    {folder.isSelected ? <SquareCheck /> : <Square  />}
  </div>
  
  {/* Pin Icon */}
  <div onClick={() => onTogglePin(folder.folder_id)} className="relative cursor-pointer">
    {folder.isPinned ? (
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

          <div className="font-normal text-2xl flex flex-row items-center">
          <Link to={"/saved/"+folder.folder_id} >
          <Folder className="h-6 w-6 text-center items-center"/></Link>
            <Link to={"/saved/"+folder.folder_id} className="pl-2">
            {folder.folder_name}</Link>
          </div>
        </div>
        <div className="flex flex-row align-middle items-center w-96 justify-between pr-12 text-xl">
          <div className="">{formatDate(folder.created_at)}</div>
          <div>{folder.article_count} Articles</div>
        </div>
      </div>
    );
  };
  
  const Saved = () => {

    document.title = "Saved"
    const { user } = useAuth();
  
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
    const [folderState, setFolderState] = useState<Folder[]>([]);
    const [pinnedFolderIds, setPinnedFolderIds] = useState<string[]>([]); // State to store pinned folder IDs
  
    // Toggle delete option
    const handleToggle = () => setIsChecked(!isChecked);
  
    // Function to toggle order direction
    const toggleOrderDirection = () => setIsAscending(prev => !prev);
  
    // Function to handle setting order type
    const handleOrderTypeChange = (type: OrderType) => {
      setOrderType(type);
      setIsAscending(true);
    };
  
    // Fetch folders and pinned folders in useEffect
    useEffect(() => {
      const fetchFolders = async () => {
        if (!user || !user.id) {
          console.error('User not authenticated');
          return; // Prevent fetching if user is not authenticated
        }
  
        try {
          
  
          // Fetch pinned folders
          const pinnedFolders = await getPinnedFoldersByUserId(user.id);
          const pinnedIds = pinnedFolders.map(folder => folder.folder_id); // Extract IDs of pinned folders
          setPinnedFolderIds(pinnedIds); // Store the pinned folder IDs
          const folders: NonEmptyArray<Folder> = await getSavedFoldersByUserId(user.id);
          setFolderState(
            folders.map(folder => ({
              ...folder,
              isPinned: pinnedIds.includes(folder.folder_id) // Set isPinned correctly
            }))
          );          
        } catch (error) {
          console.error('Error fetching folders or pinned folders:', error);
        }
      };
  
      fetchFolders(); // Call the async function
    }, [user, pinnedFolderIds]); // Run this effect when `user` changes
  
    const { toast } = useToast();
  
    // Sort folders with pinned folders at the top, then by `orderType` and `isAscending`
    const sortedFolders = [...folderState].sort((a, b) => {
      // Prioritize pinned folders
      const aIsPinned = pinnedFolderIds.includes(a.folder_id);
      const bIsPinned = pinnedFolderIds.includes(b.folder_id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
  
      // Secondary sort by order type
      if (orderType === 'calendar') {
        return isAscending
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return isAscending
          ? a.folder_name.localeCompare(b.folder_name)
          : b.folder_name.localeCompare(a.folder_name);
      }
    });
  
    // Toggle selection status
    const toggleSelect = (id: string) => {
      setFolderState(prevState =>
        prevState.map(folder =>
          folder.folder_id === id ? { ...folder, isSelected: !folder.isSelected } : folder
        )
      );
    };
  
    // Toggle pinned status
    const togglePin = async (id: string) => {
      const isCurrentlyPinned = pinnedFolderIds.includes(id);
      const pinsCount = pinnedFolderIds.length;
      
  
      if ((pinsCount < 4) || isCurrentlyPinned) {
        // Update state optimistically
        setPinnedFolderIds(prevIds => {
          if (isCurrentlyPinned) {
            // Remove from pinned folder IDs
            return prevIds.filter(folderId => folderId !== id);
          } else {
            // Add to pinned folder IDs
            return [...prevIds, id];
          }
        });
  
        // Call API to add or remove from pinned folders
        try {
          if (!isCurrentlyPinned) {
            // Add to pinned folders
            await addPinnedFolder({ user_id: user.id, folder_id: id });
            toast({ title: "Folder pinned!" });
          } else {
            // Remove from pinned folders
            await removePinnedFolder({ user_id: user.id, folder_id: id });
            toast({ title: "Folder unpinned!" });
          }
        } catch (error) {
          console.error('Error toggling pinned status:', error);
  
          // Revert state on error
          setPinnedFolderIds(prevIds => {
            if (isCurrentlyPinned) {
              return [...prevIds, id]; // Re-add the folder if it was pinned
            } else {
              return prevIds.filter(folderId => folderId !== id); // Remove it if it was unpinned
            }
          });
        }
        
      } else {
        toast({ title: "Pin Limit: You can only pin 4 folders" });
      }
    };
  
    return (
      <div className="flex flex-col justify-start items-center min-w-96">
        <Toaster />
        <div className="absolute left-0 right-0">
          <div className="text-5xl ml-80 mt-16 font-light">Folders</div>
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
            <div className="hover:bg-stone-100 p-1 rounded-md ml-4 cursor-pointer">
              <Dialog>
                <DialogTrigger><Plus /></DialogTrigger>
                <DialogContent>
                  <NewFolderForm article_id="none"/>
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
          {sortedFolders.map(folder => (
            <FolderItem
              key={folder.folder_id}
              folder={folder}
              onToggleSelect={toggleSelect}
              onTogglePin={togglePin}
            />
          ))}
        </div>

      </div>
    );
  };
  

export default Saved

