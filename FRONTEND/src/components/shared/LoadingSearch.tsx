import { useState, useEffect } from 'react';
import { Puff } from 'react-loading-icons'; // Adjust the import path as needed

const statements: string[] = [
    "Reading scientific articles",
    "Filtering relevant results",
    "Analyzing metadata for accuracy",
    "Classifying papers by topic",
    "Identifying meta studies",
    "Applying AI filters",
    "Organizing your search results",
    "Prioritizing high-quality research",
    "Refining search for precision",
    "Preparing data for your query",
    // Add more variations
    "Gathering data",
    "Synthesizing literature",
    "Cross-referencing related research",
    "Validating findings with peer-reviewed articles",
    "Summarizing key insights",
    "Extracting data from complex studies",
    "Evaluating research impact",
    "Consolidating search results for clarity",
    "Curating relevant publications",
    "Assessing research trends"
];

interface PuffPosition {
    id: number; // Unique ID for the puff
    position: { x: number; y: number };
    size: number; // New property for puff size
}

const getRandomPosition = (containerWidth: number, containerHeight: number, size: number): { x: number; y: number } => {
    const x = Math.floor(Math.random() * (containerWidth - size));
    const y = Math.floor(Math.random() * (containerHeight - size));
    return { x, y };
};

const getRandomSize = (): number => {
    return Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Random size between 50 and 150
};

const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const LoadingSearch: React.FC = () => {
    const [currentStatement, setCurrentStatement] = useState<string>("Starting your search");
    const [index, setIndex] = useState<number>(0);
    const [puffs, setPuffs] = useState<PuffPosition[]>([]);
    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
    const [shuffledStatements, setShuffledStatements] = useState<string[]>([]);

    useEffect(() => {
        setShuffledStatements(shuffleArray([...statements])); // Shuffle statements on mount
    }, []);

    useEffect(() => {
        const statementInterval = setInterval(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                if (shuffledStatements.length > 0) {
                    setCurrentStatement(shuffledStatements[index]);
                    setIndex((prevIndex) => (prevIndex + 1) % shuffledStatements.length);
                } else {
                    // Reset index and shuffle again if all statements have been shown
                    setIndex(0);
                    setShuffledStatements(shuffleArray([...statements]));
                }
                setIsFadingOut(false);
            }, 2500);
        }, 3000);

        return () => {
            clearInterval(statementInterval);
        };
    }, [index, shuffledStatements]);

    useEffect(() => {
        const puffInterval = setInterval(() => {
            const container = document.getElementById('loading-container');
            if (container) {
                const { clientWidth, clientHeight } = container;
                const size = getRandomSize();
                const position = getRandomPosition(clientWidth, clientHeight, size);
                setPuffs((prevPuffs) => {
                    // Limit puffs to a maximum of 8
                    if (prevPuffs.length < 8) {
                        return [...prevPuffs, { id: Date.now(), position, size }];
                    }
                    return prevPuffs; // Do not add if already 8
                });
            }
        }, 1000); // Add new puff every 1000 ms

        return () => {
            clearInterval(puffInterval);
        };
    }, []);

    useEffect(() => {
        const removePuffsInterval = setInterval(() => {
            setPuffs((prevPuffs) => {
                // Remove puffs that are older than 4000 ms with a fade-out effect
                return prevPuffs.filter((puff) => {
                    const puffAge = Date.now() - puff.id;
                    if (puffAge >= 4000) {
                        return false; // Remove puff after 4000 ms
                    }
                    return true; // Keep puff if not older than 4000 ms
                });
            });
        }, 1000); // Check every 1000 ms

        return () => {
            clearInterval(removePuffsInterval);
        };
    }, []);

    // Function to draw lines between puffs with a 30% chance of appearing
    const renderLines = () => {
        return puffs.map((puff1, index1) =>
            puffs.map((puff2, index2) => {
                if (index1 < index2) {
                    // 30% probability to draw the line
                    if (Math.random() < 0.3) {
                        return (
                            <line
                                key={`line-${puff1.id}-${puff2.id}`}
                                x1={puff1.position.x + puff1.size / 2}
                                y1={puff1.position.y + puff1.size / 2}
                                x2={puff2.position.x + puff2.size / 2}
                                y2={puff2.position.y + puff2.size / 2}
                                className="transition-opacity duration-700 ease-in-out opacity-0 animate-fade-line" // Tailwind classes
                                style={{
                                    stroke: '#333', // Darker color
                                    strokeWidth: '2',
                                }}
                            />
                        );
                    }
                }
                return null;
            })
        );
    };

    return (
        <div id="loading-container" className="relative flex justify-center items-center w-full h-[550px] bg-white overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full">
                <g>{renderLines()}</g>
            </svg>
            {puffs.map((puff) => (
                <div
                    key={puff.id}
                    className={`absolute transition-opacity duration-500 ${Date.now() - puff.id >= 4000 ? 'opacity-0' : 'opacity-100'}`} // Fading effect
                    style={{
                        left: puff.position.x,
                        top: puff.position.y,
                    }}
                >
                    <Puff
                        width={puff.size}
                        height={puff.size}
                        speed={0.5}
                        stroke="#000"
                        strokeWidth={0.3}
                    />
                </div>
            ))}
            <div
                className={`absolute text-center top-0 mt-24 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
            >
                <p className="text-2xl text-black">{currentStatement}</p>
            </div>
        </div>
    );
};

export default LoadingSearch;
