
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
// Define Quiz Structure
interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

// Define Course Structure including Quiz
interface CourseData {
    title: string;
    videoId: string;
    quiz: QuizQuestion[];
}

const coursesData: { [key: string]: CourseData } = {
  'intro-stock-market': {
    title: 'Intro to Stock Market',
    videoId: 'YSgk5_WXDfE',
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
  },
  'options-trading-basics': {
    title: 'Options Trading Basics',
    videoId: 'sdMfLkg3MgQ', // Replace with actual video ID if available
    quiz: [
      {
        id: 'opt_q1',
        question: 'What does a Call Option give the buyer the right to do?',
        options: [
          'Sell the underlying asset at a specific price',
          'Buy the underlying asset at a specific price',
          'Receive dividends from the underlying asset',
          'Borrow the underlying asset',
        ],
        correctAnswer: 'Buy the underlying asset at a specific price',
      },
      {
        id: 'opt_q2',
        question: 'What is the "strike price" of an option?',
        options: [
          'The current market price of the underlying asset',
          'The price at which the option contract was bought',
          'The price at which the buyer can buy or sell the underlying asset',
          'The highest price the underlying asset reached',
        ],
        correctAnswer: 'The price at which the buyer can buy or sell the underlying asset',
      },
      {
        id: 'opt_q3',
        question: 'If you expect a stock\'s price to go down significantly, which basic option strategy might you consider?',
        options: [
          'Buying a Call Option',
          'Selling a Covered Call',
          'Buying a Put Option',
          'Selling a Put Option',
        ],
        correctAnswer: 'Buying a Put Option',
      },
    ],
  },
   'technical-analysis-101': {
    title: 'Technical Analysis 101',
    videoId: 'eynxyoKgpng', // Replace with actual video ID if available
    quiz: [
      {
        id: 'ta_q1',
        question: 'What does technical analysis primarily focus on?',
        options: [
          'Company financial statements',
          'Economic news and events',
          'Historical price movements and patterns',
          'Insider trading activity',
        ],
        correctAnswer: 'Historical price movements and patterns',
      },
      {
        id: 'ta_q2',
        question: 'A "support level" on a stock chart typically represents:',
        options: [
          'A price level where selling pressure overcomes buying pressure',
          'A price level where buying pressure tends to overcome selling pressure',
          'The highest price the stock has ever reached',
          'A guaranteed floor price for the stock',
        ],
        correctAnswer: 'A price level where buying pressure tends to overcome selling pressure',
      },
      {
        id: 'ta_q3',
        question: 'What is a common use of a Moving Average indicator?',
        options: [
          'Predicting exact future prices',
          'Identifying the direction of a trend',
          'Calculating company profits',
          'Measuring market volatility',
        ],
        correctAnswer: 'Identifying the direction of a trend',
      },
    ],
  },
   'fundamental-analysis-guide': {
    title: 'Fundamental Analysis Guide',
    videoId: 'DvpaF3g_798', // Replace with actual video ID if available
    quiz: [
      {
        id: 'fa_q1',
        question: 'Fundamental analysis aims to determine a stock\'s:',
        options: [
          'Short-term price fluctuations',
          'Intrinsic or fair value',
          'Popularity among traders',
          'Chart patterns',
        ],
        correctAnswer: 'Intrinsic or fair value',
      },
      {
        id: 'fa_q2',
        question: 'Which financial statement shows a company\'s assets, liabilities, and equity at a specific point in time?',
        options: [
          'Income Statement',
          'Cash Flow Statement',
          'Balance Sheet',
          'Annual Report Summary',
        ],
        correctAnswer: 'Balance Sheet',
      },
      {
        id: 'fa_q3',
        question: 'What does the P/E (Price-to-Earnings) ratio generally indicate?',
        options: [
          'A company\'s total debt',
          'How much investors are willing to pay per dollar of earnings',
          'The company\'s dividend payout',
          'The company\'s cash reserves',
        ],
        correctAnswer: 'How much investors are willing to pay per dollar of earnings',
      },
    ],
  },
};


type AnswersState = { [key: string]: string };
type ResultsState = { [key: string]: boolean | null };

// NOTE: params is a Promise in Client Components with App Router
export default function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  // Use React.use to unwrap the Promise
  // This hook must be called inside the component body
  const { courseId } = React.use(params); // Get courseId from unwrapped params

  const courseData = coursesData[courseId]; // Get specific course data

  const router = useRouter();
  const [answers, setAnswers] = useState<AnswersState>({});
  const [results, setResults] = useState<ResultsState>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  React.useEffect(() => {
    // Ensure this runs only on the client
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    updateSize(); // Set initial size
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle case where course data might not be found (e.g., invalid courseId)
  if (!courseData) {
    // Optionally redirect or show a 'not found' message
    // router.push('/courses'); // Example redirect
     return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">The learning content for this course could not be found.</p>
            <Link href="/courses" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
              </Button>
            </Link>
        </div>
      );
  }

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
    // Removed surrounding div and header/footer elements
    <div className="container mx-auto px-4 py-12"> {/* Changed main to div, added container/padding */}
      {showConfetti && typeof window !== 'undefined' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

       {/* Back to Course Link */}
        <div className="mb-8">
           <Link href={`/courses/${courseId}`} passHref>
             <Button variant="outline" size="sm">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Course Details
             </Button>
           </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">{courseData.title} - Learn</h1>


        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle>Course Video</CardTitle>
            <CardDescription>Watch this video to learn the basics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full max-w-3xl mx-auto bg-muted rounded-lg overflow-hidden shadow-inner">
              {/* Basic YouTube Embed */}
               <iframe
                  className="w-full h-full" // Use className for Tailwind
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

        <Card className="shadow-md" id="quiz-card"> {/* Added ID for potential scrolling */}
           <CardHeader>
            <CardTitle>Quiz Time!</CardTitle>
            <CardDescription>Test your knowledge with these questions.</CardDescription>
          </CardHeader>
           <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }}>
              <div className="space-y-6">
                {courseData.quiz.map((q, index) => (
                   <div key={q.id} className={`p-4 border rounded-lg transition-colors duration-300 ${quizSubmitted ? (results[q.id] ? 'border-green-300 bg-green-50/50 dark:bg-green-900/20 dark:border-green-700' : 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-700') : 'border-border'}`}>
                    <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                    <RadioGroup
                      value={answers[q.id]}
                      onValueChange={(value) => handleAnswerChange(q.id, value)}
                      disabled={quizSubmitted}
                      className="space-y-2" // Add spacing between radio options
                    >
                      {q.options.map((option) => (
                        <div key={option} className="flex items-center space-x-3"> {/* Increased spacing */}
                          <RadioGroupItem value={option} id={`${q.id}-${option}`} className="border-primary text-primary focus:ring-primary" />
                          <Label htmlFor={`${q.id}-${option}`} className={`cursor-pointer flex-1 ${quizSubmitted ? 'text-muted-foreground' : ''}`}>
                             {option}
                             {/* Feedback icons and text next to the option */}
                              {quizSubmitted && results[q.id] === false && option === q.correctAnswer && (
                               <span className="text-xs text-green-600 dark:text-green-400 ml-2 font-normal">(Correct Answer)</span>
                             )}
                             {quizSubmitted && results[q.id] === false && option === answers[q.id] && (
                               <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 inline-block ml-2" />
                             )}
                             {quizSubmitted && results[q.id] === true && option === q.correctAnswer && (
                               <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 inline-block ml-2" />
                             )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {quizSubmitted && results[q.id] === false && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">Incorrect. The correct answer is: {q.correctAnswer}</p>
                    )}
                    {quizSubmitted && results[q.id] === true && (
                       <p className="text-xs text-green-600 dark:text-green-400 mt-2">Correct!</p>
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
                 <div className="mt-8 p-6 border rounded-lg text-center bg-secondary/50 dark:bg-secondary/20">
                    <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
                    <p className="mb-4 text-muted-foreground">You answered {score} out of {totalQuestions} questions correctly.</p>
                    {isPassed ? (
                      <div className="flex flex-col items-center space-y-4">
                         <CheckCircle className="h-12 w-12 text-accent" />
                         <p className="text-lg font-medium text-accent">Congratulations! You passed!</p>
                         <Link href={`/courses/${courseId}/certificate`} passHref>
                           <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                              Claim Your Certificate
                           </Button>
                         </Link>
                      </div>
                    ) : (
                       <div className="flex flex-col items-center space-y-4">
                         <XCircle className="h-12 w-12 text-destructive" />
                         <p className="text-lg font-medium text-destructive">
                             Keep learning! You need to answer all questions correctly to pass.
                         </p>
                         <Button onClick={() => {
                           setAnswers({});
                           setResults({});
                           setQuizSubmitted(false);
                           setShowConfetti(false);
                           // Scroll to top of quiz section might be helpful here
                            const quizCard = document.getElementById('quiz-card');
                            quizCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          variant="outline"
                          >
                            Try Quiz Again
                          </Button>
                       </div>
                    )}
                 </div>
               )}
            </form>
          </CardContent>
        </Card>
      </div>
    // Removed Footer
  );
}
