
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Link } from 'react-router-dom';
import { UserPen } from "lucide-react";
  
  // Define the types for the article props
  interface AuthorProps {
    name: string;
    author_id: string;
    number_of_articles:number;
  }
  
  // ArticleCard Function
function AuthorCard({ name, author_id, number_of_articles }: AuthorProps) {
    return (
      <div className="flex flex-row items-center align-middle w-full p-6">
        <UserPen color="#78716c" height={"36px"} width={"36px"}/>
        <Card className="border-hidden shadow-none w-full">
      <CardHeader className='-mb-3 w-full border-l-2 border-stone-200 ml-6 pl-6 my-2 py-4'>
        <CardTitle className="hover:underline"><Link to={"/author/"+author_id}>{name}</Link></CardTitle>
        <CardDescription>
          <div className='flex flex-row items-center justify-between'>
            
            <div className='flex flex-row items-start justify-start'>
            <div className="text-stone-500">Author</div>
            </div>
            <div className='pl-3'>{number_of_articles} Articles </div>
          </div>  
        </CardDescription>
      </CardHeader>
      
    </Card></div>
    );
  }
  
  export default AuthorCard