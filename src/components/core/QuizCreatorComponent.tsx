import React, { useState } from 'react';

// TypeScript models
type QuestionType = 'multiple_choice' | 'true_false' | 'essay';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: QuestionType;
  answers: Answer[];
  responses?: string[]; // For essay questions
}

interface Quiz {
  title: string;
  email_address: string;
  questions: Question[];
}

const EditableField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className="w-full p-2 border rounded"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="p-2 border rounded cursor-pointer hover:bg-gray-100">
      {value || placeholder}
    </div>
  );
};

const QuizCreatorComponent: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    email_address: '',
    questions: [],
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | string[])[]>([]);

  const handleQuizChange = (field: keyof Quiz, value: string) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, [field]: value }));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };

      // If changing to true/false, set up default answers
      if (field === 'type' && value === 'true_false') {
        newQuestions[index].answers = [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: false },
        ];
      }
      // If changing from true/false to multiple choice, keep existing answers
      else if (field === 'type' && value === 'multiple_choice' && newQuestions[index].type === 'true_false') {
        // Do nothing, keep existing True/False answers
      }
      // If changing to multiple choice (not from true/false) or essay, reset answers
      else if (field === 'type' && (value === 'multiple_choice' || value === 'essay')) {
        newQuestions[index].answers = value === 'essay' ? [] : [{ text: '', isCorrect: false }];
      }

      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, field: keyof Answer, value: any) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[questionIndex].answers[answerIndex] = {
        ...newQuestions[questionIndex].answers[answerIndex],
        [field]: value,
      };
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        { text: '', type: 'multiple_choice', answers: [{ text: '', isCorrect: false }] },
      ],
    }));
  };

  const addAnswer = (questionIndex: number) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      newQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const addResponse = (questionIndex: number) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      if (!newQuestions[questionIndex].responses) {
        newQuestions[questionIndex].responses = [];
      }
      newQuestions[questionIndex].responses!.push('');
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleResponseChange = (questionIndex: number, responseIndex: number, value: string) => {
    setQuiz((prevQuiz) => {
      const newQuestions = [...prevQuiz.questions];
      if (!newQuestions[questionIndex].responses) {
        newQuestions[questionIndex].responses = [];
      }
      newQuestions[questionIndex].responses![responseIndex] = value;
      return { ...prevQuiz, questions: newQuestions };
    });
  };

  const handleUserAnswerChange = (questionIndex: number, value: string | string[]) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  };

  const saveQuiz = async () => {
    console.log('Saving quiz:', quiz);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) {
        throw new Error('Failed to save quiz');
      }
      const data = await response.json();
      console.log('Quiz saved successfully:', data);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Quiz</h1>
      <div className="mb-4">
        <button onClick={() => setIsPreviewMode(!isPreviewMode)} className="bg-blue-500 text-white p-2 rounded">
          {isPreviewMode ? 'Exit Preview' : 'Preview Quiz'}
        </button>
      </div>
      {!isPreviewMode && (
        <>
          <EditableField
            value={quiz.title}
            onChange={(value) => handleQuizChange('title', value)}
            placeholder="Click to add Quiz Title"
          />
          <EditableField
            value={quiz.email_address}
            onChange={(value) => handleQuizChange('email_address', value)}
            placeholder="Click to add Email Address"
          />
        </>
      )}
      <h2 className="text-xl font-semibold mt-4 mb-2">Questions</h2>
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4 p-2 border rounded">
          {isPreviewMode ? (
            <p className="font-semibold">{question.text}</p>
          ) : (
            <EditableField
              value={question.text}
              onChange={(value) => handleQuestionChange(questionIndex, 'text', value)}
              placeholder={`Click to edit Question ${questionIndex + 1}`}
            />
          )}
          {!isPreviewMode && (
            <select
              value={question.type}
              onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value as QuestionType)}
              className="mt-2 p-2 border rounded"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="essay">Essay</option>
            </select>
          )}
          {question.type !== 'essay' && (
            <>
              <h3 className="font-semibold mt-2 mb-1">Answers:</h3>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center">
                  {isPreviewMode ? (
                    <label className="flex items-center">
                      <input
                        type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                        name={`question-${questionIndex}`}
                        checked={
                          question.type === 'multiple_choice'
                            ? ((userAnswers[questionIndex] as string[]) || []).includes(answer.text)
                            : userAnswers[questionIndex] === answer.text
                        }
                        onChange={() => {
                          if (question.type === 'multiple_choice') {
                            const currentAnswers = (userAnswers[questionIndex] as string[]) || [];
                            const newAnswers = currentAnswers.includes(answer.text)
                              ? currentAnswers.filter((a) => a !== answer.text)
                              : [...currentAnswers, answer.text];
                            handleUserAnswerChange(questionIndex, newAnswers);
                          } else {
                            handleUserAnswerChange(questionIndex, answer.text);
                          }
                        }}
                        className="mr-2"
                      />
                      {answer.text}
                    </label>
                  ) : (
                    <>
                      {question.type === 'true_false' ? (
                        <div className="flex items-center">
                          <span className="mr-2">{answer.text}</span>
                          <label className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              checked={answer.isCorrect}
                              onChange={(e) =>
                                handleAnswerChange(questionIndex, answerIndex, 'isCorrect', e.target.checked)
                              }
                              className="mr-1"
                            />
                            Correct
                          </label>
                        </div>
                      ) : (
                        <>
                          <EditableField
                            value={answer.text}
                            onChange={(value) => handleAnswerChange(questionIndex, answerIndex, 'text', value)}
                            placeholder={`Click to edit Answer ${answerIndex + 1}`}
                          />
                          <label className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              checked={answer.isCorrect}
                              onChange={(e) =>
                                handleAnswerChange(questionIndex, answerIndex, 'isCorrect', e.target.checked)
                              }
                              className="mr-1"
                            />
                            Correct
                          </label>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
              {!isPreviewMode && question.type === 'multiple_choice' && (
                <button onClick={() => addAnswer(questionIndex)} className="bg-blue-500 text-white p-2 rounded mt-2">
                  Add Answer
                </button>
              )}
            </>
          )}
          {question.type === 'essay' && (
            <>
              <h3 className="font-semibold mt-2 mb-1">Responses:</h3>
              {isPreviewMode ? (
                <textarea
                  value={(userAnswers[questionIndex] as string) || ''}
                  onChange={(e) => handleUserAnswerChange(questionIndex, e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              ) : (
                <>
                  {question.responses &&
                    question.responses.map((response, responseIndex) => (
                      <EditableField
                        key={responseIndex}
                        value={response}
                        onChange={(value) => handleResponseChange(questionIndex, responseIndex, value)}
                        placeholder={`Click to edit Response ${responseIndex + 1}`}
                      />
                    ))}
                  <button
                    onClick={() => addResponse(questionIndex)}
                    className="bg-blue-500 text-white p-2 rounded mt-2"
                  >
                    Add Response
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
      {!isPreviewMode && (
        <>
          <button onClick={addQuestion} className="bg-green-500 text-white p-2 rounded mt-2">
            Add Question
          </button>
          <button onClick={saveQuiz} className="bg-purple-500 text-white p-2 rounded mt-4 ml-2">
            Save Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizCreatorComponent;
