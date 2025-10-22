import { useEffect, useState } from 'react';
import { To } from 'react-router-dom';
import ArticleCard from './ArticleCard';

// Define the types for the article props
interface ArticleProps {
    title: string;
    authors: string;
    date: string;
    abstract: string;
    pdfurl: To;
    citations: number;
    id: string;
}

// RandomisingArticleColumn Function
function RandomisingArticleColumn({ articles }: { articles: ArticleProps[] }) {
    const [modifiedArticles, setModifiedArticles] = useState<ArticleProps[]>(articles);
    const [changeRate, setChangeRate] = useState<number>(0); // Percentage of changes from 0 to 100

    useEffect(() => {
        // Function to gradually increase change rate
        const increaseChangeRate = () => {
            const duration = 10000; // 10 seconds
            const interval = 100; // Check every 100 ms
            const totalSteps = duration / interval; // Number of steps
            let currentStep = 0;

            const changeRateInterval = setInterval(() => {
                if (currentStep <= totalSteps) {
                    setChangeRate((currentStep / totalSteps) * 90 +10);
                    currentStep++;
                } else {
                    clearInterval(changeRateInterval);
                }
            }, interval);
        };

        increaseChangeRate();
    }, []);

    useEffect(() => {
        const updateModifiedArticles = () => {
            setModifiedArticles((prevArticles) => {
                return prevArticles.map((article) => {
                    const newTitle = modifyText(article.title);
                    const newAuthors = modifyText(article.authors);
                    const newDate = modifyText(article.date);
                    const newAbstract = modifyText(article.abstract);

                    return {
                        ...article,
                        title: newTitle,
                        authors: newAuthors,
                        date: newDate,
                        abstract: newAbstract,
                    };
                });
            });
        };

        const interval = setInterval(updateModifiedArticles, 200);
        return () => clearInterval(interval);
    }, [changeRate]); // Add changeRate as a dependency to re-run the effect when it updates

    const modifyText = (text: string): string => {
        const chars = text.split('');
        const numberOfChanges = Math.floor((changeRate / 100) * Math.min(chars.length, 10)); // Cap changes at 10 for practical reasons
        const positionsToChange = new Set<number>();

        while (positionsToChange.size < numberOfChanges) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            positionsToChange.add(randomIndex);
        }

        positionsToChange.forEach((index) => {
            chars[index] = getRandomCharacter(); // Replace character at the random index
        });

        return chars.join('');
    };

    const getRandomCharacter = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    };

    if (modifiedArticles.length === 0) {
        return (
            <div className="flex justify-center pt-12 align-top text-xl">
                <p>No results found...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {modifiedArticles.map((article, index) => (
                <ArticleCard
                    key={index}
                    title={article.title}
                    authors={article.authors}
                    date={article.date}
                    description={article.abstract}
                    pdfurl={article.pdfurl}
                    citations={article.citations}
                    article_id={article.id}
                />
            ))}
        </div>
    );
}

export default RandomisingArticleColumn;
