// // "use client";
// // import React, { useEffect, useState, useRef, useCallback } from 'react';
// // import { ref, getDownloadURL } from 'firebase/storage';
// // import { ref as dbref, push, set, get, serverTimestamp, onValue } from 'firebase/database';
// // import { useSearchParams, usePathname } from 'next/navigation';
// // import { UserAuth } from "../context/AuthContext.mjs";
// // import { storage, database } from '../firebase';

// // import { Document, Page, pdfjs } from 'react-pdf';
// // import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faArrowLeft, faArrowRight, faSearchPlus, faSearchMinus, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
// // import ReactMarkdown from 'react-markdown';
// // import parse, { domToReact, Element } from 'html-react-parser';

// // // import './page.css';
// // import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// // import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// // import 'react-pdf/dist/esm/Page/TextLayer.css';

// // // import { GoogleGenerativeAI } from '@google/generative-ai';
// // import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"; 

// // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATAIVE_AI_API_KEY || "";
// // const generativeAi = new GoogleGenerativeAI(apiKey);

// // const generationConfig = {
// //   temperature: 1,
// //   topP: 0.95,
// //   topK: 64,
// //   maxOutputTokens: 8192,
// //   responseMimeType: "text/plain",
// // };
 

// // interface Question {
// //   question: string;
// //   text: string;
// //   timestamp: number;
// // }


// // export default function PV(props: any) {
// //   const [text, setText] = useState("");
// //   const [quizActive, setQuizActive] = useState(false);
// //   const [messages, setMessages] = useState<{ role: string; content: string, type: string }[]>([]);
// //   const [userAnswer, setUserAnswer] = useState("");
// //   const [questions, setQuestions] = useState<Question[]>([]);
// //   const [generatedQuestions, setGeneratedQuestions] = useState<String[]>([]);
// //   const [numOfGeneratedQuestions, setNumOfGeneratedQuestions] = useState(0);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const model = generativeAi.getGenerativeModel({ model: 'gemini-pro' });
  
// //   const summarizeText = async () => {
// //     try {
// //       const summaryModel = generativeAi.getGenerativeModel({
// //         model: "gemini-1.5-flash",
// //         systemInstruction: "You are an AI teaching assistant. Break into points whatever is inputted by user so that it becomes easy to understand. Return as markdown.",
// //       });
// //       const chatSession = summaryModel.startChat({
// //         generationConfig
// //       });
// //       const result = await chatSession.sendMessage(text);
// //       const summaryText = result.response.text();
// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         { 
// //             role: 'user', 
// //             content: "Summarize",
// //             type: 'text'
// //         },
// //         { 
// //             role: 'assistant', 
// //             content: summaryText,
// //             type: 'summary' 
// //         },
// //       ]);
// //     } catch (error) {
// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         { 
// //             role: 'user', 
// //             content: text,
// //             type: 'text'
// //         },
// //         {
// //           role: 'assistant',
// //           content: 'An error occurred while summarizing the text.',
// //           type: 'error'
// //         },
// //       ]);
// //     }
// //     setUserAnswer("");
// //   };

// //   function extractUsefulStrings(inputString: String) {
// //     const openingBracketIndex = inputString.indexOf("[");
// //     const closingBracketIndex = inputString.indexOf("]");
// //     if (openingBracketIndex === -1 || closingBracketIndex === -1) {
// //       return [];
// //     }
// //     const bracketContent = inputString.substring(openingBracketIndex + 1, closingBracketIndex);
// //     const usefulStrings = bracketContent.split(",");
// //     return usefulStrings.map(str => str.trim());
// //   }

// //   const generateQuestions = async () => {
// //     try {
// //       const questionsModel = generativeAi.getGenerativeModel({
// //         model: "gemini-1.5-flash",
// //         systemInstruction: "You are an AI teaching assistant. Strictly return a list of questions that cover the entire text inputted by user. Return a list format in javascript dont use markdown.",
// //       });
// //       const chatSession = questionsModel.startChat({
// //         generationConfig
// //       });

// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         {
// //           role: 'user',
// //           content: 'Test my understanding',
// //           type: 'text'
// //         },
// //       ]);
// //       setQuizActive(true);
// //       const result = await chatSession.sendMessage(text);
// //       const questionsText = result.response.text();
// //       const questionsList = extractUsefulStrings(questionsText);
// //       if (questionsList.length === 0) {
// //         throw new Error();
// //       }
// //       setGeneratedQuestions(questionsList);
// //       setNumOfGeneratedQuestions(questionsList.length);
// //       setCurrentQuestionIndex(0);
// //       displayQuestion(0);
// //     } catch (e) {
// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         {
// //           role: 'assistant',
// //           content: 'An error occurred while generating the questions. Try again.',
// //           type: 'error'
// //         },
// //       ]);
// //     }
// //   }


// //   const handleStopQuiz = () => {
// //     setQuizActive(false);
// //     setMessages((prevMessages) => [
// //       ...prevMessages,
// //       {
// //         role: 'assistant',
// //         content: 'Quiz stopped.',
// //         type: 'notification',
// //       },
// //     ]);
// //     setText("");
// //   };
// //   const displayQuestion = async (currentQuestionIndex: number) => {
// //     if (numOfGeneratedQuestions <= currentQuestionIndex) {
// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         {
// //           role: 'assistant',
// //           content: 'Great work! That the end of all questions.',
// //           type: 'notification',
// //         },
// //       ]);
// //       return;
// //     }
// //     const question = generatedQuestions[currentQuestionIndex];
// //     setMessages((prevMessages) => [
// //       ...prevMessages,
// //       {
// //         role: 'assistant',
// //         content: question.toString(),
// //         type: 'question'
// //       },
// //     ]);
// //   }

// //   const feedbackModel = generativeAi.getGenerativeModel({
// //     model: "gemini-1.5-flash",
// //     systemInstruction: `You are a AI financial assistant. Answer the question user asks. Don't use markdown.`
// //   });

// //   const handleSubmitStringAnswer = async (userAnswer: string) => {
// //       const chatSession = feedbackModel.startChat({
// //         generationConfig
// //       });
// //       const prompt = `question: ${userAnswer}`;
// //       const response = await chatSession.sendMessage(prompt);
// //       const answer = response.response.text();
// //       await new Promise(resolve => setTimeout(resolve, 2000));
// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         { role: 'user', content: userAnswer, type: 'answer' },
// //         { role: 'assistant', content: answer, type: 'feedback' },
// //       ]);
// //     setUserAnswer("");
// //   };
  
// //   return (
// //   <div>
// //   <div className="flex flex-row">
// //     <div className="w-full h-screen">
// //       <div className="flex flex-col h-screen">
// //       <div className="bg-gray-900 ">
// //       <div className="container mx-auto text-center bg-gray-900 py-4">
// //         <div className="text-white mb-4">
// //           Hi! 👋 How can I help?
// //         </div>
// //       </div>
// //     </div>
// //         <div className="flex-grow p-6 overflow-y-auto bg-gray-800 rounded-3xl	m-4">
// //           {messages.map((message, index) => (
// //             <div
// //               key={index}
// //               className={`flex flex-col ${
// //                 message.role === 'user' ? 'items-end' : 'items-start'
// //               } mb-4`}
// //             >
// //               <div
// //                 className={`${
// //                   message.role === 'user'
// //                     ? 'bg-blue-700 text-white'
// //                     : 'bg-gray-700 text-white'
// //                 } p-3 rounded-lg`}
// //               >
// //                 <ReactMarkdown>
// //                   {message.content}
// //                 </ReactMarkdown>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="p-6 bg-gray-700 border-t border-gray-600 rounded-xl mx-4">
// //         <div className="flex">
// //               <input
// //                 type="text"
// //                 className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-600 bg-gray-600 text-white rounded"
// //                 placeholder="Enter your answer..."
// //                 onChange={(e) => {
// //                   setUserAnswer(e.target.value);
// //                 }}
// //                 value={userAnswer}
// //               />
// //               <button
// //                 onClick={() => {
// //                   handleSubmitStringAnswer(userAnswer);
// //                 }}
// //                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 ml-2"
// //               >
// //                 Submit
// //               </button>
// //             </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// //   <div className="px-8 py-6 my-4 rounded-lg bg-gray-900 shadow-md">
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { ref, getDownloadURL } from 'firebase/storage';
// import { ref as dbref, push, set, get, serverTimestamp, onValue } from 'firebase/database';
// import { useSearchParams, usePathname } from 'next/navigation';
// import { UserAuth } from "../context/AuthContext.mjs";
// import { storage, database } from '../firebase';
// import { useReactMediaRecorder } from 'react-media-recorder';

// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faArrowRight, faSearchPlus, faSearchMinus, faUndo, faRedo, faMicrophone } from '@fortawesome/free-solid-svg-icons';
// import ReactMarkdown from 'react-markdown';
// import parse, { domToReact, Element } from 'html-react-parser';

// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// import { GoogleGenerativeAI } from '@google/generative-ai'; 
// const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATAIVE_AI_API_KEY || "";
// const generativeAi = new GoogleGenerativeAI(apiKey);

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// interface Question {
//   question: string;
//   text: string;
//   timestamp: number;
// }

// export default function PV(props: any) {
//   const [text, setText] = useState("");
//   const [quizActive, setQuizActive] = useState(false);
//   const [messages, setMessages] = useState<{ role: string; content: string, type: string }[]>([]);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [generatedQuestions, setGeneratedQuestions] = useState<String[]>([]);
//   const [numOfGeneratedQuestions, setNumOfGeneratedQuestions] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const model = generativeAi.getGenerativeModel({ model: 'gemini-pro' });

//   const {
//     startRecording,
//     stopRecording,
//     mediaBlobUrl,
//   } = useReactMediaRecorder({ audio: true });

//   const feedbackModel = generativeAi.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     systemInstruction: `You are a AI financial assistant. Answer the question user asks. Don't use markdown.`
//   });

//   const handleSubmitStringAnswer = async (userAnswer: string) => {
//       const chatSession = feedbackModel.startChat({
//         generationConfig
//       });
//       const prompt = `question: ${userAnswer}`;
//       const response = await chatSession.sendMessage(prompt);
//       const answer = response.response.text();
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { role: 'user', content: userAnswer, type: 'answer' },
//         { role: 'assistant', content: answer, type: 'feedback' },
//       ]);
//     setUserAnswer("");
//   };

//   return (
//   <div>
//   <div className="flex flex-row">
//     <div className="w-full h-screen">
//       <div className="flex flex-col h-screen">
//       <div className="bg-gray-900 ">
//       <div className="container mx-auto text-center bg-gray-900 py-4">
//         <div className="text-white mb-4">
//           Hi! 👋 How can I help?
//         </div>
//       </div>
//     </div>
//         <div className="flex-grow p-6 overflow-y-auto bg-gray-800 rounded-3xl	m-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex flex-col ${
//                 message.role === 'user' ? 'items-end' : 'items-start'
//               } mb-4`}
//             >
//               <div
//                 className={`${
//                   message.role === 'user'
//                     ? 'bg-blue-700 text-white'
//                     : 'bg-gray-700 text-white'
//                 } p-3 rounded-lg`}
//               >
//                 <ReactMarkdown>
//                   {message.content}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="p-6 bg-gray-700 border-t border-gray-600 rounded-xl mx-4">
//         <div className="flex">
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-600 bg-gray-600 text-white rounded"
//                 placeholder="Enter your answer..."
//                 onChange={(e) => {
//                   setUserAnswer(e.target.value);
//                 }}
//                 value={userAnswer}
//               />
//               <button
//                 onClick={() => {
//                   handleSubmitStringAnswer(userAnswer);
//                 }}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 ml-2"
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={startRecording}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 ml-2"
//               >
//                 <FontAwesomeIcon icon={faMicrophone} />
//               </button>
//               <button
//                 onClick={stopRecording}
//                 className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700 ml-2"
//               >
//                 Stop
//               </button>
//             </div>
//             {mediaBlobUrl && (
//               <audio src={mediaBlobUrl} controls className="mt-4" />
//             )}
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="px-8 py-6 my-4 rounded-lg bg-gray-900 shadow-md">
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { ref as dbref, push, set, get, serverTimestamp, onValue } from 'firebase/database';
import { useSearchParams, usePathname } from 'next/navigation';
import { UserAuth } from "../context/AuthContext.mjs";
import { storage, database } from '../firebase';
import { useReactMediaRecorder } from 'react-media-recorder';

import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faSearchPlus, faSearchMinus, faUndo, faRedo, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import parse, { domToReact, Element } from 'html-react-parser';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


import { GoogleGenerativeAI } from '@google/generative-ai'; 
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATAIVE_AI_API_KEY || "";
const generativeAi = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface Question {
  question: string;
  text: string;
  timestamp: number;
}

export default function PV(props: any) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string, type: string }[]>([]);
  const [userAnswer, setUserAnswer] = useState("");

  const feedbackModel = generativeAi.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a AI financial assistant. Answer the question user asks. Don't use markdown.`
  });

  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true });
  const handleSubmitStringAnswer = async (userAnswer: string) => {
    const chatSession = feedbackModel.startChat({
      generationConfig
    });
    const prompt = `question: ${userAnswer}`;
    const response = await chatSession.sendMessage(prompt);
    const answer = response.response.text();
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userAnswer, type: 'text' },
      { role: 'assistant', content: answer, type: 'text' },
    ]);
    setUserAnswer("");
  };

  const handleSubmitStringAnswerForAudioUrl = async (userAnswer: string) => {
    const chatSession = feedbackModel.startChat({
      generationConfig
    });
    const prompt = `question: ${userAnswer}`;
    const response = await chatSession.sendMessage(prompt);
    const answer = response.response.text();
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: answer, type: 'text' },
    ]);
    setUserAnswer("");
  };

  const waitForMediaBlobUrl = () => {
    return new Promise<string>((resolve) => {
      const checkMediaBlobUrl = () => {
        if (mediaBlobUrl) {
          resolve(mediaBlobUrl);
        } else {
          setTimeout(checkMediaBlobUrl, 100);
        }
      };
      checkMediaBlobUrl();
    });
  };
  const waitForClearBlobUrl = () => {
    return new Promise<string>((resolve) => {
      const clearMediaBlobUrl = () => {
        if (mediaBlobUrl) {
          setTimeout(clearMediaBlobUrl, 100);
        }
      };
      clearMediaBlobUrl();
    });
  };
  
  const handleSubmitAudioAnswer = async () => {
    stopRecording();
    console.log(mediaBlobUrl);
  
    const blobUrl: string = await waitForMediaBlobUrl();
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: blobUrl, type: 'audio' }
    ]);
    handleSubmitStringAnswerForAudioUrl("What is a debit card?");
    waitForClearBlobUrl();
  };
  
  return (
    <div>
      <div className="flex flex-row">
        <div className="w-full h-screen">
          <div className="flex flex-col h-screen">
            <div className="bg-gray-900 ">
              <div className="container mx-auto text-center bg-gray-900 py-4">
                <div className="text-white mb-4">
                  Hi! 👋 How can I help?
                </div>
              </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-gray-800 rounded-3xl m-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} mb-4`}
                >
                  <div className={`${message.role === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-white'} p-3 rounded-lg`}>
                    {message.type === 'text' && (<ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>)}
                  </div>
                  {
                      message.type === 'audio' && (
                        <audio src={message.content} controls className="mt-4" />
                      )
                    }
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-700 border-t border-gray-600 rounded-xl mx-4">
              <div className="flex">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-600 bg-gray-600 text-white rounded"
                  placeholder="Enter your answer..."
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                  }}
                  value={userAnswer}
                />
                <button
                  onClick={() => {
                    handleSubmitStringAnswer(userAnswer);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 ml-2"
                >
                  Submit
                </button>
                <button
                  onClick={startRecording}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 ml-2"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>
                <button
                  onClick={handleSubmitAudioAnswer}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700 ml-2"
                >
                  Stop
                </button>
              </div>
              {/* {mediaBlobUrl && (
                <audio src={mediaBlobUrl} controls className="mt-4" />
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 py-6 my-4 rounded-lg bg-gray-900 shadow-md">
      </div>
    </div>
  );
}
