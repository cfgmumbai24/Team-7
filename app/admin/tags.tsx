import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext.mjs';
import { storage } from '../firebase';
import { ref, uploadString } from 'firebase/storage';

type TagSelectorProps = {
  tags: string[];
  onSubmit: (selectedTags: string[]) => void;
};

const TagSelector: React.FC<TagSelectorProps> = () => {
  const tags = ['BASICS OF MONEY', 
    'SAVINGS', 
    'FINANCIAL PLANNING AND BUDGETING', 
    'BANKING', 
    'LOANS',
    'INSURANCE',
    'FINANCIAL RECORD',
    'DIGITAL FINANCIAL SERVICES',
    'CONSUMER PROTECTION AND GRIEVANCE REDRESSAL',
    'SCAMS AND PONZI SCHEMES',
    'INVESTEMENTS',
    'TAXATION',
    'RETIREMENT PLANS',
    'FINANCIAL INDEPENDENCE AND YOU'
    ];
  const {user} = UserAuth();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const [submittedTags, setSubmittedTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const onSubmit = () => {
    handleTagSubmit(submittedTags);
  }
  const handleTagSubmit = async (selectedTags: string[]) => {
      if(selectedTags.length !== 0) {
          setSubmittedTags(selectedTags);
      } else {
          return;
      }
      console.log('Submitted Tags:', selectedTags);
      try {
          const tagsJSON = JSON.stringify(selectedTags);
          console.log(tagsJSON);
          const storageRef = ref(storage, `tags/${user?.uid}/submittedTags.json`);
          await uploadString(storageRef, tagsJSON, 'raw');
          console.log('Submitted Tags uploaded to Cloud Storage');
      } catch (error) {
          console.error('Error uploading submitted tags:', error);
      }
    };

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-2"> 
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
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
