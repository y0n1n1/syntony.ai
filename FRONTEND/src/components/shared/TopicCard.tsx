
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Link } from 'react-router-dom';
import { GitCompare } from "lucide-react";
  
  // Define the types for the article props
  interface TopicProps {
    topic: string;
    topic_id: string;
    number_of_articles:number;
    topic_type:string;
  }

  type ConversionMap = {
    [key: string]: string;
  };
  
  const mapping: ConversionMap = {
    "used_algorithms": "Algorithm",
    "taxonomy_learning_type": "Learning method",
    "taxonomy_experiment_type": "Experiment type",
    "taxonomy_topics":"Topic",
    "taxonomy_areas": "Area",
    "tasks_list_of_tasks": "Task",
    "modalities": "Modality",
    "mod_known_models_used": "Model",
    "mod_evaluation_metrics_for_models": "Metric",
    "expdet_training_frameworks": "Training framework",
    "expdet_hardware": "Hardware",
    "deep_learning_techniques_used": "Technique",
    "data_type": "Data type",
    "data_datasets_used": "Dataset",
    "by_institutions": "Institution",
    "application_domain": "Application",
  };
  
function TopicTypeConvert(input: string): string {
    return mapping[input] || input; // Return the mapped value, or the input itself if no mapping is found
  }

  function capitalizeFirstLetter(sentence: string): string {
    if (!sentence) return sentence; // Handle empty or null strings
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
  
  // ArticleCard Function
function TopicCard({ topic, topic_type,topic_id, number_of_articles }: TopicProps) {
    return (
      <div className="flex flex-row items-center align-middle w-full p-6 py-1">
        <GitCompare color="#78716c" height={"36px"} width={"36px"}/>
        <Card className="border-hidden shadow-none w-full">
      <CardHeader className='-mb-3 w-full border-l-2 border-stone-200 ml-6 pl-6  my-2 py-4'>
        <CardTitle className="hover:underline"><Link to={"/topic/"+topic_id}>{capitalizeFirstLetter(topic)}</Link></CardTitle>
        <CardDescription>
          <div className='flex flex-row items-center justify-between'>
            
            <div className='flex flex-row items-start justify-start'>
            <div className="text-stone-500">{TopicTypeConvert(topic_type)}</div>
            </div>
            <div className='pl-3'>{number_of_articles} Articles </div>
          </div>  
        </CardDescription>
      </CardHeader>
      
    </Card></div>
    );
  }
  
  export default TopicCard