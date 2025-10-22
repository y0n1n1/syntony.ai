import { addArticleView, getArticleById, getArticleViewsById } from '@/api/articleAPI';
import { useAuth } from '@/api/authContext';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Article } from '@/api/articleAPI'
import {  ChevronsLeft, Eye, Check, X } from 'lucide-react';

  import { Bookmark, Plus } from "lucide-react";
  import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table"
  
  import 'katex/dist/katex.min.css';
  import Latex from 'react-latex-next';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
  import { NewFolderForm } from "@/components/custom/CreateFolderForm";
import { createSavedArticle } from '@/api/savedArticleAPI';


export const getDomainName = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (error) {
      console.error("Invalid URL provided:", url);
      return "";
    }
  };


function formatDate(isoString: string): string {
    const date = new Date(isoString);
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  
    return date.toLocaleDateString('en-US', options);
  }
  const joinArrayToSentence = (items: string[]): string => {
    if (items.length === 0) return '';
    const displayedAuthors = items.join(', ');
    return displayedAuthors;
  };


function formatViewCount(number: number): string {
    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        let thousands = parseFloat((number / 1000).toFixed(1));
        return thousands % 1 === 0 ? `${Math.round(thousands)}K` : `${thousands}K`;
    } else {
        let millions = parseFloat((number / 1000000).toFixed(1));
        return millions % 1 === 0 ? `${Math.round(millions)}M` : `${millions}M`;
    }
}
type NonEmptyArray<T> = [T, ...T[]];
import { Folder } from "@/_search/pages/Saved"
import { getSavedFoldersByUserId } from '@/api/savedFolderAPI';


const ArticlePage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [article_info, setArticleInfo] = useState<Article | null>(null);
  const [view_info, setViewInfo] = useState<number | null>(null);

  useEffect(() => {
    const fetchArticleInfo = async () => {
      try {
        const article_in = await getArticleById(id||"")
        setArticleInfo(article_in)
        document.title = article_in?.title
        console.log(article_info);
        const view_in = await getArticleViewsById(id||"")
        setViewInfo(view_in)
        // ADD VIEW
        if ((id) && (user.id != "")){
            addArticleView(id, user.id)
        }
        return null
      } catch (error) {
        console.error("Error fetching article info:", error);
      }
    };

    fetchArticleInfo();
  }, [id]);

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
    <div className="flex flex-col justify-start items-center">
      {/* Header */}
      <div className="absolute left-0 right-0">
          <Link to='/search' className="text-xl ml-80 w-min mt-3 font-normal text-stone-400 hover:text-stone-600 flex flex-row justify-start items-center"><ChevronsLeft className='w-5 h-5'/> Search</Link>
          <div className="text-4xl mx-80 mt-1 font-semibold"><Latex>{article_info?.title||""}</Latex></div>
          <div className="mb-2 mt-4 border-b-2 mx-80"></div>
        <div className='flex flex-row justify-between items-center mx-80'>
            <div className='text-lg font-normal text-stone-800 flex flex-row items-center'>{joinArrayToSentence(article_info?.authors||[])}</div>
        </div>
        <div className='flex flex-row justify-between items-center mx-80'>
            <div className='text-lg font-normal text-stone-800 flex flex-row items-center mb-2'>Published on {formatDate(article_info?.published_date||"")}</div>
        </div>
        <div className='flex flex-row justify-between items-center mx-80'>
        <div className='flex flex-row justify-start items-center my-2'><Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger>
                <div className='flex flex-row mr-3 text-lg text-stone-800 items-center' ><Bookmark className="w-6 h-6 mr-1"/>Save</div></DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[250px] mt-2 ml-12">
                <DropdownMenuLabel key="0f82n0f" className="text-black text-xl">Folders</DropdownMenuLabel>
                <DropdownMenuSeparator key="0ff432n0f" />
                {/*  Add article to folder  */}
                {folder_list.map(item => (
                <DropdownMenuItem key="item.folder_id" className="text-black text-xl" onClick={(event) => saveArticle(event, item.folder_id, article_info?.id||"")}>
                    
                    <div className="cursor-pointer">
                    {item.folder_name}
                    </div>
                </DropdownMenuItem>
                ))}
                <DialogTrigger key="9n4f99"  onClick={(e) => e.stopPropagation()}><Plus /></DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent  onClick={(e) => e.stopPropagation()}>
                <NewFolderForm article_id={article_info?.id||""}/>
                {/*  Add article to folder  */}
            </DialogContent>
            </Dialog>
            <div className='flex flex-row text-lg font-normal text-stone-800 items-center'><Eye className='pr-2 w-8 h-8'/>{formatViewCount(view_info||0)}</div></div>
            
            {(article_info?.pdf_url && (
                <a className='hover:underline flex flex-row hover:text-blue-500 text-lg' target="_blank" rel="noopener noreferrer" href={article_info.pdf_url}>{"[ "}PDF - {getDomainName(article_info.pdf_url)} {" ]"}</a>
            ))}
        </div>
        <div className='mx-80 font-normal text-xl py-4 text-justify'>
                <Latex>{article_info?.abstract||""}</Latex>
                <div className='w-full text-3xl my-2'>Content</div>
                <div>
                  
                  <Table className="w-full mt-5">
                  <div className=" border-2 rounded-3xl text-left">
                

<TableBody>
  {[
    { label: 'Areas', value: article_info?.meta?.taxonomy_areas?.join(', ') },
    { label: 'Topics', value: article_info?.meta?.taxonomy_topics?.join(', ') },
    { label: 'Experiment type', value: article_info?.meta?.taxonomy_experiment_type?.join(', ') },
    { label: 'Learning type', value: article_info?.meta?.taxonomy_learning_type?.join(', ') },
    { label: 'Tasks', value: article_info?.meta?.tasks_list_of_tasks?.join(', ') },
    { label: 'By institutions', value: article_info?.meta?.by_institutions?.join(', ') },
    { label: 'Data type', value: article_info?.meta?.data_type?.join(', ') },
    { label: 'Modalities', value: article_info?.meta?.modalities?.join(', ') },
    { label: 'Contains novel creation', value: article_info?.meta?.novel_present ? <Check /> : <X /> },
    { label: 'Novel creation', value: article_info?.meta?.novel_name },
    { label: 'Category of novel creation', value: article_info?.meta?.novel_category },
    { label: 'Hardware details', value: article_info?.meta?.expdet_hardware?.join(', ') },
    { label: 'Used algorithms', value: article_info?.meta?.used_algorithms?.join(', ') },
    { label: 'Code availability', value: article_info?.meta?.code_availability ? <Check /> : <X /> },
    { label: 'Dataset size', value: article_info?.meta?.data_dataset_size },
    { label: 'Application domain', value: article_info?.meta?.application_domain?.join(', ') },
    { label: 'Datasets used', value: article_info?.meta?.data_datasets_used?.join(', ') },
    { label: 'Contains synthetic data', value: article_info?.meta?.data_synthetic_data ? <Check /> : <X /> },
    { label: 'Contains new architecture', value: article_info?.meta?.mod_new_architecture ? <Check /> : <X /> },
    { label: 'Models used', value: article_info?.meta?.mod_known_models_used?.map((model, idx) => `${model} (${article_info?.meta?.mod_pretrained_models?.[idx] ? <Check /> : <X />})`).join(', ') },
    { label: 'Explanation', value: article_info?.meta?.application_explanation },
    { label: 'Frameworks', value: article_info?.meta?.expdet_training_frameworks?.join(', ') },
    { label: 'Key findings', value: article_info?.meta?.research_focus_key_findings },
    { label: 'Techniques', value: article_info?.meta?.deep_learning_techniques_used?.join(', ') },
    { label: 'Computational resources', value: article_info?.meta?.expdet_computational_resources },
    { label: 'Primary objective', value: article_info?.meta?.research_focus_primary_objective },
    { label: 'Contains real-world deployment', value: article_info?.meta?.application_real_world_deployment ? <Check /> : <X /> },
    { label: 'Evaluation metrics', value: article_info?.meta?.mod_evaluation_metrics_for_models?.join(', ') },
  ].map((row, idx) => (
    <TableRow key={idx}>
      <TableCell className="text-xl font-medium text-stone-600">{row.label}</TableCell>
      <TableCell className="text-lg">{row.value || 'Unknown'}</TableCell>
    </TableRow>
  ))}

  
  {/* Final row for unknown items */}
  <TableRow>
    <TableCell className="text-xl font-medium text-stone-600">Unknown Fields</TableCell>
    <TableCell className="text-lg">
      {Object.keys(article_info?.meta || {} as Record<string, any>).filter(
        (key) => !article_info?.meta?.[key as keyof typeof article_info.meta]
      ).map((key) => key.replace(/_/g, ' ')).join(', ') || 'None'}
    </TableCell>
  </TableRow>
  
</TableBody>

                  </div>
                  
                </Table>
                </div>
            </div>
          
        </div>
       
    </div>
  )
}



export default ArticlePage
