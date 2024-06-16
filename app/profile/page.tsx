"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { storage, database, auth, db, firestore } from '../firebase';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"; 
import TagSelector from './tags';
import { arrayUnion, doc, setDoc, DocumentReference } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext.mjs';
import { ref, uploadString } from 'firebase/storage';
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATAIVE_AI_API_KEY || "";
const generativeAi = new GoogleGenerativeAI(apiKey);
import ConsentButton from './button';
import ConsentToggle2 from './buttonGS';
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
 
export default function Profile () {
    const {user} = UserAuth();
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
    const [submittedTags, setSubmittedTags] = useState<string[]>([]);
    const [text, setText] = useState("");
    const [number, setNumber] = useState("");
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
            const storageRef = ref(storage, `usertags/${user?.uid}/submittedTags.json`);
            await uploadString(storageRef, tagsJSON, 'raw');
            console.log('Submitted Tags uploaded to Cloud Storage');
        } catch (error) {
            console.error('Error uploading submitted tags:', error);
        }
    };

    const handleTextChange = (e: any) => {
        setText(e.target.value);
    };

    const handleNumberChange = (e: any) => {
        setText(e.target.value);
    };
    function extractUsefulStrings(inputString: String) {
        const openingBracketIndex = inputString.indexOf("[");
        const closingBracketIndex = inputString.indexOf("]");
        if (openingBracketIndex === -1 || closingBracketIndex === -1) {
          return [];
        }
        const bracketContent = inputString.substring(openingBracketIndex, closingBracketIndex+1);
        return bracketContent;
      }
    const generateTags = async (e: any) => {
        const summaryModel = generativeAi.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `Generate a JSON.stringfied component of the tags that are attached as per the user text. tags: ${tags}. Return an empty JSON.stringify component if the user input is insufficient.`,
          });
          const chatSession = summaryModel.startChat({
            generationConfig
          });
          const result = await chatSession.sendMessage(text);
          const summaryText = extractUsefulStrings(result.response.text());
          const array = JSON.parse(summaryText as string);
          setSubmittedTags(array);
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        generateTags(e);
        console.log('Submitted text:', text);
      };
    useEffect(() => {
        console.log(user?.uid);
        handleTagSubmit(submittedTags);
      }, [user, submittedTags]);
      
    return (
        <div className="flex flex-col items-center">
    <h1 className="text-4xl font-semibold my-4 text-white text-center">Profile</h1>
    <div className="text-white">
        Select tags that interest you
    </div>
    <div className="w-2/3">
        <TagSelector tags={tags} onSubmit={handleTagSubmit} />
    </div>
    <h2 className="text-white mt-2 text-xl py-4">
        OR
    </h2>
    <form onSubmit={handleSubmit} className="space-y-1 flex flex-col items-center w-2/3">
    <input
        type="text"
        value={text}
        onChange={handleTextChange}
        className={`px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full`}
        placeholder="Enter text..."
    />
    {/* <input
        type="text"
        value={number}
        onChange={handleNumberChange}
        className={`px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full`}
        placeholder="Enter text..."
    /> */}
    <button
        type="submit"
        className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full mt-2"
    >
        Submit
    </button>
</form>
{/* <h1 className="text-4xl font-semibold my-4 text-white text-center">Courses Completed</h1> */}
<ConsentButton/>
<ConsentToggle2/>
</div>

    )
}
