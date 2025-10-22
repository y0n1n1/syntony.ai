import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
const KeywordTextArea: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && input.trim()) {
      setKeywords([...keywords, input.trim()]);
      setInput('');
      e.preventDefault(); // Prevent newline
    }
  };

  
  return (
    <div className="relative flex flex-wrap gap-1">
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter keywords..."
        className="border p-2 rounded-lg w-full min-h-[100px] resize-none"
        rows={3}
      />
      {keywords.map((keyword, index) => (
        <div
          key={index}
          className="group relative inline-flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2 mt-2 transition-all duration-300 ease-in-out"
        >
          <div>{keyword}</div>
          
        </div>
      ))}
    </div>
  );
};

export default KeywordTextArea;
