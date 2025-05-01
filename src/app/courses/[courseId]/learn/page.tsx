'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation'; // Use App Router's useRouter
import Confetti from 'react-confetti'; // Add a fun effect on completion

// Mock course and quiz data - replace with data fetched from Firestore later
const courseData = {
  title: 'Intro to Stock Market',
  videoId: 'YSgk5_WXDfE', // Replace with your actual YouTube video ID
  quiz: [
    {
      id: 'q1',
      question: 'What does "stock" represent?',
      options: [
        'A loan to a company',
        'Ownership in a company',
        'A government bond',
        'A type of currency',
      ],
      correctAnswer: 'Ownership in a company',
    },
    {
      id: 'q2',
      question: 'Where are stocks typically bought and sold?',
      options: [
        'Banks',
        'Stock exchanges',
        'Directly from companies',
        'Government agencies',
      ],
      correctAnswer: 'Stock exchanges',
    },
    {
      id: 'q3',
      question: 'What is a potential risk of investing in stocks?',
      options: [
        'Guaranteed high returns',
        'No risk involved',
        'Losing the invested money',
        'Fixed interest payments',
      ],
      correctAnswer: 'Losing the invested money',
    },
  ],
};

type AnswersState = { [key: string]: string };
type ResultsState = { [key: string]: boolean | null };

export default function LearnPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params; // Get courseId from params
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswersState>({});
  const [results, setResults] = useState<ResultsState>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  React.useEffect(() => {
    // Ensure this runs only on the client
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleAnswerChange = (questionId: string, value: string) => {
    if (quizSubmitted) return; // Don't allow changes after submission
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
     setResults((prev) => ({ ...prev, [questionId]: null })); // Reset result on change
  };

  const handleSubmitQuiz = () => {
    const newResults: ResultsState = {};
    let allCorrect = true;
    courseData.quiz.forEach((q) => {
       const isCorrect = answers[q.id] === q.correctAnswer;
       newResults[q.id] = isCorrect;
       if (!isCorrect) {
         allCorrect = false;
       }
    });
    setResults(newResults);
    setQuizSubmitted(true);
    if (allCorrect) {
      setShowConfetti(true);
      // TODO: Save progress to Firestore here
    }
  };

  const allQuestionsAnswered = courseData.quiz.every((q) => answers[q.id]);
  const score = courseData.quiz.filter(q => results[q.id] === true).length;
  const totalQuestions = courseData.quiz.length;
  const isPassed = score === totalQuestions;


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
           <Link href={`/courses/${courseId}`} className="mr-6 flex items-center space-x-2 text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-5 w-5" />
             <span>Back to Course Details</span>
          </Link>
           <div className="flex-1 flex justify-center font-semibold">
              {courseData.title}
           </div>
           <div className="w-32"> {/* Placeholder to balance header */}</div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle>Course Video</CardTitle>
            <CardDescription>Watch this video to learn the basics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full max-w-3xl mx-auto bg-muted rounded-lg overflow-hidden">
              {/* Basic YouTube Embed */}
               <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${courseData.videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
               ></iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
           <CardHeader>
            <CardTitle>Quiz Time!</CardTitle>
            <CardDescription>Test your knowledge with these questions.</CardDescription>
          </CardHeader>
           <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }}>
              <div className="space-y-6">
                {courseData.quiz.map((q, index) => (
                   <div key={q.id} className={`p-4 border rounded-lg ${quizSubmitted ? (results[q.id] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}`}>
                    <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                    <RadioGroup
                      value={answers[q.id]}
                      onValueChange={(value) => handleAnswerChange(q.id, value)}
                      disabled={quizSubmitted}
                    >
                      {q.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                          <Label htmlFor={`${q.id}-${option}`} className="cursor-pointer">
                             {option}
                          </Label>
                           {quizSubmitted && results[q.id] === false && option === q.correctAnswer && (
                             <span className="text-xs text-green-600 ml-2">(Correct Answer)</span>
                           )}
                           {quizSubmitted && results[q.id] === false && option === answers[q.id] && (
                             <XCircle className="h-4 w-4 text-red-500 ml-2" />
                           )}
                           {quizSubmitted && results[q.id] === true && option === q.correctAnswer && (
                             <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                           )}
                        </div>
                      ))}
                    </RadioGroup>
                    {quizSubmitted && results[q.id] === false && (
                      <p className="text-xs text-red-600 mt-2">Incorrect. The correct answer is: {q.correctAnswer}</p>
                    )}
                  </div>
                ))}
              </div>

               {!quizSubmitted && (
                 <Button type="submit" disabled={!allQuestionsAnswered} className="mt-8 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    Submit Quiz
                  </Button>
               )}

               {quizSubmitted && (
                 <div className="mt-8 p-6 border rounded-lg text-center bg-secondary/50">
                    <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
                    <p className="mb-4">You answered {score} out of {totalQuestions} questions correctly.</p>
                    {isPassed ? (
                      <>
                         <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                         <p className="text-lg font-medium text-accent mb-4">Congratulations! You passed!</p>
                         <Link href={`/courses/${courseId}/certificate`} passHref>
                           <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                              View Your Certificate
                           </Button>
                         </Link>
                      </>
                    ) : (
                       <>
                         <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                         <p className="text-lg font-medium text-destructive mb-4">
                             Keep learning! You need to answer all questions correctly to pass.
                         </p>
                         <Button onClick={() => {
                           setAnswers({});
                           setResults({});
                           setQuizSubmitted(false);
                           setShowConfetti(false);
                          }}
                          variant="outline"
                          >
                            Try Again
                          </Button>
                       </>
                    )}
                 </div>
               )}
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} StocKaro MVP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
