import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext.mjs';

type TagSelectorProps = {
  tags: string[];
  onSubmit: (selectedTags: string[]) => void;
};

const TagSelector: React.FC<TagSelectorProps> = ({ tags, onSubmit }) => {
  const {user} = UserAuth();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedTags);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-2"> {/* Center tags horizontally */}
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-4 py-2 border rounded-xl flex justify-center ${
              selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-500'
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className='flex flex-wrap justify-center'>
        <button
          className="mt-4 px-4 py-2 bg-blue-800 text-white rounded w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
