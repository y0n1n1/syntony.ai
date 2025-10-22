import { Link, To, useParams } from 'react-router-dom';
import {  ChevronsLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Article } from '@/api/articleAPI'
import ArticleColumn from '@/components/shared/ArticleColumn';
import { getArticlesByTopicId } from '@/api/topicAPI';
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

type ConversionMap = {
    [key: string]: string;
  };
  
  const mapping: ConversionMap = {
    "used_algorithms": "Algorithm",
    "taxonomy_learning_type": "Learning method",
    "taxonomy_experiment_type": "Experiment type",
    "taxonomy_areas": "Area",
    "tasks_list_of_tasks": "Task",
    "modalities": "Modality",
    "mod_known_models_used": "Model",
    "mod_evaluation_metrics_for_models": "Metric",
    "expdet_training_frameworks": "Training framework",
    "expdet_hardware": "Hardware",
    "deep_learning_techniques_used": "Technique",
    "data_type": "Data type",
    "taxonomy_topics":"Topic",
    "data_datasets_used": "Dataset",
    "by_institutions": "Institution",
    "application_domain": "Application",
  };
  
function TopicTypeConvert(input: string): string {
    return mapping[input] || input; // Return the mapped value, or the input itself if no mapping is found
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


  function capitalizeFirstLetter(sentence: string): string {
    if (!sentence) return sentence; // Handle empty or null strings
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }


const TopicPage = () => {
  const { id } = useParams<{ id: string }>();

  const [topic_articles, setTopicArticles] = useState<ArticleProps[] | []>([]);
  const [topic, setTopic] = useState<string>("");
  const [topic_type, setTopicType] = useState<string>("");

  // 

  useEffect(() => {
    const fetchArticleInfo = async () => {
        if (id){
        try {
        
        const topic_article = await getArticlesByTopicId(id)
        const articlePropsList: ArticleProps[] = topic_article.articles.map((article: Article) => ({
            title: article.title,
            authors: joinArrayToSentence(article.authors), // Convert authors array to a single string
            date: formatDate(article.published_date),         // Use `published_date` as the `date` prop
            abstract: article.abstract,
            pdfurl: article.pdf_url || '',        // Provide a default if `pdf_url` is missing
            citations: article.citations || 0,    // Default to 0 if `citations` is missing
            id: article.id,
          }));
          setTopicArticles(articlePropsList)
        const topic_stuff = topic_article.topic
        document.title = topic
        setTopic(capitalizeFirstLetter(topic_stuff.topic))
        setTopicType(TopicTypeConvert(topic_stuff.topic_type))
      } catch (error) {
        console.error("Error fetching author info:", error);
      }}
    };

    fetchArticleInfo();
  }, [id]);
  
  return (
    <div className="flex flex-col justify-start items-center">
      {/* Header */}
      <div className="absolute left-0 right-0">
          <Link to='/search' className="text-xl ml-80 w-min mt-3 font-normal text-stone-400 hover:text-stone-600 flex flex-row justify-start items-center"><ChevronsLeft className='w-5 h-5'/> Search</Link>
          <div className='flex flex-row justify-between'><div className="text-4xl ml-80 mr-4 mt-1 font-semibold">{topic}</div><div className='text-2xl text-stone-400 mr-[340px] mt-3 font-semibold'>{topic_type}</div></div>
          <div className="mb-2 mt-4 border-b-2 mx-80"></div>
          <div className="mb-2 mt-4 border-b-2 mx-80"><ArticleColumn articles={topic_articles}/></div>
        </div>
       
    </div>
  )
}



export default TopicPage
