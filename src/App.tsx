import './App.scss'
import React, {useState, useEffect} from 'react';
import parse from 'html-react-parser';
import QuizOption from "./QuizOption";
import {useNavigate} from 'react-router-dom';
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


interface QuizItem {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface QuizResponse {
    response_code: number;
    results: QuizItem[];
}

const App: React.FC = () => {
    const [quiz, setQuiz] = useState<QuizItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [shuffledChoices, setShuffledChoices] = useState<string[][]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple`);
                const data: QuizResponse = await response.json();
                if (data.results !== undefined) {
                    setQuiz(data.results);
                    shuffleChoices(data.results);
                } else {
                    console.log("Quiz data is null");
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.log("Error:", err);
            }
        };

        if (quiz.length !== 20) {
            fetchQuizData();
        }
    }, [quiz]);

    const shuffleChoices = (quizData: QuizItem[]): void => {
        const shuffled = quizData.map((quizItem) => {
            const choices = [quizItem.correct_answer, ...quizItem.incorrect_answers];
            return shuffle(choices);
        });
        setShuffledChoices(shuffled);
    };

    const shuffle = (array: string[]): string[] => {
        let currentIndex = array.length;
        let temporaryValue = '';
        let randomIndex: number = 0;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };


    const handleAnswerSelection = (questionIndex: string, selectedOption: string, actualValue: string, actualIndex: number): void => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [actualIndex]: actualValue
        }));

        const element = document.querySelector<HTMLInputElement>(`input[name=${questionIndex}]`);

        if (element) {
            const parentElement = element.parentNode as HTMLInputElement

            if (selectedOption === 'correct') {
                parentElement.style.background = 'green';
                parentElement.style.color = 'white';
                parentElement.style.padding = '5px';
                parentElement.style.borderRadius = '8px';
            } else {
                parentElement.style.background = 'red';
                parentElement.style.color = 'white';
                parentElement.style.padding = '5px';
                parentElement.style.borderRadius = '8px';
            }

            disableFormAfterChoose(element)
        }
    };

    const disableFormAfterChoose = (element: HTMLInputElement): void => {
        const all_input = element.closest('.question')!.querySelectorAll('.answer input');
        const input_array = Array.from(all_input);

        input_array.map(item => {
            (item as HTMLInputElement).disabled = true;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        processScore();
        navigate('/summary', {state: {selectedAnswers: selectedAnswers}});
    };

    const processScore = (): void => {
        let score = 0;
        quiz.forEach((quizItem, main_index) => {
            if (quizItem.correct_answer === selectedAnswers[main_index]) {
                score += 1;
            }
        });
        localStorage.setItem('quiz_score', score.toString());
    };

    const refreshPage = (): void => {
        // wait one second prevent API server block for frequency requests
        setTimeout(function (){
            window.location.href = "/"
        }, 1000)
    }

    return (
        <div className="row pt-5 pb-5 w-100 justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center card w-75">
                {loading ? (
                    <div>...Data Loading.....</div>
                ) : (
                    <>
                        <h1 className="mb-3">20 Quiz Game</h1>
                        <form className="form" onSubmit={handleSubmit}>
                            {quiz.map((quizItem, main_index) => (
                                <div key={main_index} className={`question question_${main_index}`}>
                                    <div className="question">
                                        <label
                                            className="form-label mt-2">{main_index + 1}. {parse(quizItem.question)}</label>
                                    </div>
                                    <div className="answer mb-3">
                                        {shuffledChoices.length > 0 && shuffledChoices[main_index].map((choice, index) => (
                                            <div key={`option_${main_index}_${index}`}>
                                                <QuizOption
                                                    uniqKey={`option_${main_index}_${index}`}
                                                    name={`option_${main_index}_${index}`}
                                                    value={choice}
                                                    onChange={() => handleAnswerSelection(`option_${main_index}_${index}`,
                                                        choice === quizItem.correct_answer ? 'correct' : 'incorrect',
                                                        choice, main_index
                                                    )}
                                                    label={parse(choice) as React.JSX.Element}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {quiz.length > 0 ?
                                (<button type="submit" className="btn btn-primary mt-2 w-100 mb-5">Submit</button>)
                                : (<Link to={{pathname: "/"}} onClick={refreshPage}>If quiz not show click this and wait 1 second</Link>)
                            }
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
