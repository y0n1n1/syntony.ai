import ArticleCard from './ArticleCard';
import AuthorCard from './AuthorCard';
import TopicCard from './TopicCard';

// Define the types for the article props
export interface ItemProps {
  item:any;
  result_type:string;
  score:number;
}
function getFirstFiveItems(list: string[]): string {
    const firstFive = list.slice(0, 5); // Get the first five items
    return firstFive.join(', '); // Join them with commas
  }

// ArticleColumn Function
function GeneralColumn(tl:{items:ItemProps[]}) {
    
  if (tl.items.length === 0) {
    return (
      <div className="flex justify-center pt-12 align-top text-xl">
        <p>No results found...</p>
      </div>
    );
  }
  console.log(tl)

  return (
    <div className="flex flex-col">
      {
      tl.items.map((itm, index) => {
        // Conditional rendering for ArticleCard or AuthorCard
        if (itm.result_type === "article") {
          return (
            <ArticleCard
              key={index}
              title={itm.item.title}
              authors={getFirstFiveItems(itm.item.authors)}
              date={itm.item.published_date}
              description={itm.item.abstract}
              pdfurl={itm.item.pdf_url||""}
              citations={itm.item.citations}
              article_id={itm.item.id}
            />
          );
        } else if (itm.result_type === "author") {
          return (
            <AuthorCard
              key={index}
              name={itm.item.name}
              author_id={itm.item.id}
              number_of_articles={itm.item.number_of_articles}
            />
          );
        } else if (itm.result_type === "topic") {
            return (
              <TopicCard
              topic= {itm.item.topic}
              topic_type={itm.item.topic_type}
              topic_id= {itm.item.id}
                number_of_articles={itm.item.number_of_articles}
              />
            );
          }
        // Return null if no matching type is found
        return null;
      })}
    </div>
  );
}

export default GeneralColumn;
