import React, { useState, useEffect } from 'react';
import topics from '@/data/topics2024.json'; // Adjust the path to your JSON file
import { Input } from '../ui/input';

interface RandomPlaceholderInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add this
}

const RandomPlaceholderInput: React.FC<RandomPlaceholderInputProps> = ({ value, onChange }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const typingSpeed = 100; // Speed of typing each character in milliseconds
  const deletingSpeed = 100; // Speed of deleting each character in milliseconds
  const pauseTime = 2000; // Time to pause after the full text is typed

  useEffect(() => {
    const getRandomTopic = () => {
      const randomIndex = Math.floor(Math.random() * topics.topics2024.length);
      return topics.topics2024[randomIndex];
    };

    const typeText = () => {
      if (charIndex < currentTopic.length) {
        setDisplayedText(currentTopic.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => setIsDeleting(true), pauseTime); // Wait before starting to delete
      }
    };

    const deleteText = () => {
      if (charIndex > 0) {
        setDisplayedText(currentTopic.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        setIsDeleting(false);
        setCurrentTopic(getRandomTopic());
        setCharIndex(0); // Reset character index for the new topic
      }
    };

    if (!currentTopic) {
      setCurrentTopic(getRandomTopic());
    }

    const interval = setInterval(() => {
      if (isDeleting) {
        deleteText();
      } else {
        typeText();
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearInterval(interval);
  }, [charIndex, isDeleting, currentTopic]);

  return (
    <Input
      placeholder={displayedText}
      value={value}  // Controlled input
      onChange={onChange}  // Event handler passed from the form
      className='border bg-white p-6 text-lg rounded-3xl  w-full justify-start  items-start align-top flex flex-row border-stone-200 '
    />
  );
};

export default RandomPlaceholderInput;
