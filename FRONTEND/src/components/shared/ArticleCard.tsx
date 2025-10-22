
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark, Plus } from "lucide-react";
import { Link} from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  getSavedFoldersByUserId } from "@/api/savedFolderAPI";
import { Folder } from "@/_search/pages/Saved"
import { useAuth } from "@/api/authContext";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { NewFolderForm } from "../custom/CreateFolderForm";
import { createSavedArticle } from "@/api/savedArticleAPI";
import Latex from "react-latex-next";
import AuthorDiv from "./AuthorDiv";

// Define the types for the article props
interface ArticleProps {
  title: string;
  authors: string;
  date: string;
  description: string;
  pdfurl: string;
  citations:number|null;
  article_id:string;
}

function formatToMonthDayYear(isoDateString: string): string {
  const date = new Date(isoDateString); // Parse the ISO date string
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}


const limitDescription = (description: string, wordLimit: number) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};

/*const joinArrayToSentence = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};*/

type NonEmptyArray<T> = [T, ...T[]];


// ArticleCard Function
function ArticleCard({ title, authors, date, description, pdfurl, citations, article_id }: ArticleProps) {
  const { user } = useAuth()

  const [folder_list, setFolderState] = useState<Folder[]>([]);
  
    // Fetch folders in useEffect
  useEffect(() => {
    const fetchFolders = async () => {
      if (!user || !user.id) {
        console.error('User not authenticated');
        return; // Prevent fetching if user is not authenticated
      }

      try {
        const folders: NonEmptyArray<Folder> = await getSavedFoldersByUserId(user.id);
        setFolderState(folders.map(folder => ({ ...folder }))); // Set the folders in state
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders(); // Call the async function
  }, [user]); // Run this effect when `user` changes

  const saveArticle = (event: React.MouseEvent<HTMLDivElement>, folder_id:string, article_id:string) => {
    createSavedArticle({folder_id:folder_id, article_id:article_id, user_id:user.id})
  };
  
  


  return (
    <Card className="border-hidden shadow-none">
      <CardHeader className='-mb-3'>
        <CardTitle className="hover:underline"><Link to={"/article/"+article_id}><Latex>{title}</Latex></Link></CardTitle>
        <CardDescription>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-start justify-start'>
            <div className='pr-3'>{formatToMonthDayYear(date)}</div>
            <div>By {authors} </div>
            </div>
            {
  citations ? (
    <div className='pl-3'>{citations} Citations</div>
  ) : null
}

          </div>  
        </CardDescription>
      </CardHeader>
      <CardContent className='-mb-6'>
        <p><Latex>{limitDescription(description, 50)}</Latex></p>
      </CardContent>
      <div className="flex justify-between items-center text-center p-3 pb-2">
        <div className="text-base text-stone-600 mb-3 mx-5  hover:underline cursor-pointer">

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
            <Bookmark className="w-5 h-5"/></DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[250px] mt-2 ml-12">
              <DropdownMenuLabel className="text-black text-xl">Folders</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/*  Add article to folder  */}
              {folder_list.map(item => (
              <DropdownMenuItem className="text-black text-xl" onClick={(event) => saveArticle(event, item.folder_id, article_id)}>
                
                <div className="cursor-pointer">
                  {item.folder_name}
                </div>
              </DropdownMenuItem>
              ))}
              <DialogTrigger  onClick={(e) => e.stopPropagation()}  className="ml-1"><Plus /></DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent  onClick={(e) => e.stopPropagation()}>
            <NewFolderForm article_id={article_id}/>
            {/*  Add article to folder  */}
          </DialogContent>
        </Dialog>
          
          </div>
        <Link to={pdfurl} target="_blank" rel="noopener noreferrer" className="text-base text-stone-600 mb-3 mx-5 hover:underline">PDF</Link>
      </div>
    </Card>
  );
}

export default ArticleCard