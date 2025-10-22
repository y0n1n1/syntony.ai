import { useAuth } from '@/api/authContext';
import { Link, To, useParams } from 'react-router-dom';
import {  ChevronsLeft } from 'lucide-react';
import { getArticlesIdsByAuthorId, getAuthorNameByAuthorId } from '@/api/authorAPI';
import { useEffect, useState } from 'react';
import { Article, getArticlesByIds } from '@/api/articleAPI'
import ArticleColumn from '@/components/shared/ArticleColumn';
// Define the types for the article props
interface ArticleProps {
  title: string;
  authors: string;
  date: string;
  abstract: string;
  pdfurl: To;
  citations: number;
  id:string;
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
  const joinArrayToSentence = (items: string[], maxAuthors: number = 5): string => {
    if (items.length === 0) return '';
    const displayedAuthors = items.slice(0, maxAuthors).join(', ');
    return items.length > maxAuthors ? `${displayedAuthors} ...` : displayedAuthors;
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


const AuthorPage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [author_articles, setAuthorArticles] = useState<ArticleProps[] | []>([]);
  const [author_name, setAuthorName] = useState<string>("");

  // getArticlesIdsByAuthorId, getAuthorIdByAuthorName, getAuthorIdsByArticleId

  useEffect(() => {
    const fetchArticleInfo = async () => {
      try {
        const author_article_inf = await getArticlesIdsByAuthorId(id||"")
        const author_article = await getArticlesByIds(author_article_inf)
        const articlePropsList: ArticleProps[] = author_article.map((article: Article) => ({
            title: article.title,
            authors: joinArrayToSentence(article.authors), // Convert authors array to a single string
            date: formatDate(article.published_date),         // Use `published_date` as the `date` prop
            abstract: article.abstract,
            pdfurl: article.pdf_url || '',        // Provide a default if `pdf_url` is missing
            citations: article.citations || 0,    // Default to 0 if `citations` is missing
            id: article.id,
          }));
        setAuthorArticles(articlePropsList)
        const name = await getAuthorNameByAuthorId(id||"")
        setAuthorName(name)
        document.title = name
      } catch (error) {
        console.error("Error fetching author info:", error);
      }
    };

    fetchArticleInfo();
  }, [id]);
  
  return (
    <div className="flex flex-col justify-start items-center">
      {/* Header */}
      <div className="absolute left-0 right-0">
          <Link to='/search' className="text-xl ml-80 w-min mt-3 font-normal text-stone-400 hover:text-stone-600 flex flex-row justify-start items-center"><ChevronsLeft className='w-5 h-5'/> Search</Link>
          <div className='flex flex-row justify-between'><div className="text-4xl ml-80 mr-4 mt-1 font-semibold">{author_name}</div><div className='text-2xl text-stone-400 mr-[340px] mt-3 font-semibold'>Author</div></div>
          <div className="mb-2 mt-4 border-b-2 mx-80"></div>
          <div className="mb-2 mt-4 border-b-2 mx-80"><ArticleColumn articles={author_articles}/></div>
        </div>
       
    </div>
  )
}



export default AuthorPage
