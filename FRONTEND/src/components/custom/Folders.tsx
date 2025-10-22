import { Square, SquareCheck, Pin, PinOff } from 'lucide-react'; // Import your icons here

// Define a Folder type
interface Folder {
  id: string;
  title: string;
  date: string;
  article_count: number;
  isPinned: boolean;
  isSelected: boolean;
}

interface FolderItemProps {
  folder: Folder;
  onTogglePin: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

/*
    id: string;
    title: string;
    date: string;
    articleCount: number;
    isPinned: boolean;
    isSelected: boolean;
    */

export const FolderItem: React.FC<FolderItemProps> = ({ folder, onTogglePin, onToggleSelect }) => {
  return (
    <div className="flex w-full flex-row p-4 align-middle justify-between items-center">
      <div className="flex flex-row align-middle items-center">
        <div className="flex flex-row rounded-md mr-3 hover:bg-stone-100 p-1">
          {/* Select Checkbox */}
          <div onClick={() => onToggleSelect(folder.id)} className="cursor-pointer mr-1">
            {folder.isSelected ? <SquareCheck /> : <Square />}
          </div>
          {/* Pin Icon */}
          <div onClick={() => onTogglePin(folder.id)} className="group cursor-pointer">
            {folder.isPinned ? (
              <PinOff className="group-hover:hidden" />
            ) : (
              <Pin className="group-hover:hidden" />
            )}
            <PinOff className="hidden group-hover:flex" />
          </div>
        </div>
        <div className="font-semibold text-3xl">
          {folder.title}
        </div>
      </div>
      <div className="flex flex-row align-middle items-center pr-12 text-xl">
        <div className="pr-24">{folder.date}</div>
        <div>{folder.article_count} Articles</div>
      </div>
    </div>
  );
};