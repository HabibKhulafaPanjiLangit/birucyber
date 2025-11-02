'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Award,
  Terminal,
  FileText,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  level: string
  duration: string
  difficulty: number
  prerequisites: string[]
  objectives: string[]
  sections: Array<{
    id: string
    title: string
    duration: string
    type: 'theory' | 'practical'
    content: any
  }>
  resources: Array<{
    title: string
    type: string
    url: string
  }>
  quiz: Array<{
    question: string
    options: string[]
    correct: number
    explanation: string
  }>
}

interface ModuleViewerProps {
  moduleId: string
  onBack: () => void
  onComplete: (moduleId: string) => void
}

export default function ModuleViewer({ moduleId, onBack, onComplete }: ModuleViewerProps) {
  const [module, setModule] = useState<Module | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModule()
  }, [moduleId])

  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/modules?id=${moduleId}`)
      const result = await response.json()
      if (result.success) {
        setModule(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch module:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId]
      setCompletedSections(newCompleted)
      
      const newProgress = (newCompleted.length / (module?.sections.length || 1)) * 100
      setProgress(newProgress)
      
      if (newProgress === 100) {
        onComplete(moduleId)
      }
    }
  }

  const handleQuizSubmit = () => {
    setShowQuizResults(true)
    const correctAnswers = Object.entries(quizAnswers).filter(
      ([questionIndex, answer]) => module?.quiz[parseInt(questionIndex)]?.correct === answer
    ).length
    
    if (correctAnswers === module?.quiz.length) {
      handleSectionComplete('quiz')
    }
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setShowQuizResults(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading module...</p>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Module not found</p>
          <Button onClick={onBack}>Back to Modules</Button>
        </div>
      </div>
    )
  }

  const currentSectionData = module.sections[currentSection]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{module.title}</h1>
                <p className="text-slate-600">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{module.level}</Badge>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-1" />
                {module.duration}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Module Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {module.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSection === index
                        ? 'bg-blue-50 border border-blue-200'
                        : completedSections.includes(section.id)
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    onClick={() => setCurrentSection(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {section.type === 'theory' ? (
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Terminal className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      {completedSections.includes(section.id) && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{section.duration}</div>
                  </div>
                ))}
                
                {/* Quiz Section */}
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSection === module.sections.length
                      ? 'bg-purple-50 border border-purple-200'
                      : completedSections.includes('quiz')
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentSection(module.sections.length)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Quiz</span>
                    </div>
                    {completedSections.includes('quiz') && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{module.quiz.length} questions</div>
                </div>
              </CardContent>
            </Card>

            {/* Module Info */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Module Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-slate-700 mb-2">Objectives</h4>
                  <ul className="space-y-1">
                    {module.objectives.map((objective, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-start">
                        <Target className="h-3 w-3 mr-1 mt-0.5 text-blue-600" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-slate-700 mb-2">Prerequisites</h4>
                  <ul className="space-y-1">
                    {module.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-start">
                        <Award className="h-3 w-3 mr-1 mt-0.5 text-green-600" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentSection < module.sections.length ? (
              <SectionContent
                section={currentSectionData}
                onComplete={() => handleSectionComplete(currentSectionData.id)}
                isCompleted={completedSections.includes(currentSectionData.id)}
              />
            ) : (
              <QuizContent
                quiz={module.quiz}
                answers={quizAnswers}
                onAnswerChange={setQuizAnswers}
                onSubmit={handleQuizSubmit}
                showResults={showQuizResults}
                onReset={resetQuiz}
                isCompleted={completedSections.includes('quiz')}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={() => setCurrentSection(Math.min(module.sections.length, currentSection + 1))}
                disabled={currentSection === module.sections.length}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Resources */}
        {module.resources.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {module.resources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{resource.title}</h4>
                    <Button variant="link" className="p-0 h-auto text-xs">
                      Open Resource
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function SectionContent({ section, onComplete, isCompleted }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {section.type === 'theory' ? (
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              ) : (
                <Terminal className="h-5 w-5 mr-2 text-green-600" />
              )}
              {section.title}
            </CardTitle>
            <CardDescription>{section.duration}</CardDescription>
          </div>
          {isCompleted && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            {section.type === 'practical' && <TabsTrigger value="exercise">Exercise</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {section.type === 'theory' ? (
              <div className="prose max-w-none">
                {section.content.overview && (
                  <p className="text-slate-700 mb-4">{section.content.overview}</p>
                )}
                
                {section.content.keyPoints && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Key Points:</h4>
                    <ul className="space-y-2">
                      {section.content.keyPoints.map((point: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-slate-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {section.content.types && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Types:</h4>
                    <div className="space-y-4">
                      {section.content.types.map((type: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <h5 className="font-medium text-slate-900 mb-2">{type.name}</h5>
                          <p className="text-slate-600 text-sm mb-2">{type.description}</p>
                          {type.examples && (
                            <div className="text-xs">
                              <span className="font-medium">Examples: </span>
                              {type.examples.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {section.content.vulnerabilities && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Common Vulnerabilities:</h4>
                    <div className="space-y-4">
                      {section.content.vulnerabilities.map((vuln: any, index: number) => (
                        <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h5 className="font-medium text-red-900 mb-2">{vuln.name}</h5>
                          <p className="text-red-800 text-sm mb-2">{vuln.description}</p>
                          {vuln.examples && (
                            <div className="text-xs text-red-700">
                              <span className="font-medium">Examples: </span>
                              {vuln.examples.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {section.content.examples && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <div className="space-y-2">
                      {section.content.examples.map((example: string, index: number) => (
                        <code key={index} className="block p-3 bg-slate-100 rounded text-sm">
                          {example}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-700">
                  This is a practical exercise section. Click on the Exercise tab to start the hands-on activity.
                </p>
              </div>
            )}
          </TabsContent>
          
          {section.type === 'practical' && (
            <TabsContent value="exercise" className="space-y-4">
              <div className="space-y-6">
                {section.content.exercises?.map((exercise: any, index: number) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <h4 className="font-medium text-lg mb-2">{exercise.title}</h4>
                    <p className="text-slate-600 mb-4">{exercise.description}</p>
                    
                    {exercise.hints && (
                      <div className="mb-4">
                        <h5 className="font-medium text-sm mb-2">Hints:</h5>
                        <ul className="space-y-1">
                          {exercise.hints.map((hint: string, hintIndex: number) => (
                            <li key={hintIndex} className="text-sm text-slate-600 flex items-start">
                              <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 mr-2"></div>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exercise.solution && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                          View Solution
                        </summary>
                        <div className="mt-2 p-3 bg-blue-50 rounded text-sm font-mono">
                          {exercise.solution}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        {!isCompleted && (
          <div className="mt-6 pt-6 border-t">
            <Button onClick={onComplete} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Section Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuizContent({ quiz, answers, onAnswerChange, onSubmit, showResults, onReset, isCompleted }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-purple-600" />
              Module Quiz
            </CardTitle>
            <CardDescription>Test your understanding of the module content</CardDescription>
          </div>
          {isCompleted && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {quiz.map((question: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option: string, optionIndex: number) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={answers[index] === optionIndex}
                      onChange={(e) => onAnswerChange({ ...answers, [index]: parseInt(e.target.value) })}
                      disabled={showResults}
                    />
                    <span className={`text-sm ${
                      showResults && optionIndex === question.correct
                        ? 'text-green-600 font-medium'
                        : showResults && answers[index] === optionIndex && optionIndex !== question.correct
                        ? 'text-red-600'
                        : 'text-slate-700'
                    }`}>
                      {option}
                    </span>
                    {showResults && optionIndex === question.correct && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </label>
                ))}
              </div>
              {showResults && answers[index] !== question.correct && (
                <div className="mt-3 p-3 bg-red-50 rounded text-sm text-red-800">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!showResults ? (
          <div className="mt-6">
            <Button 
              onClick={onSubmit} 
              className="w-full"
              disabled={Object.keys(answers).length !== quiz.length}
            >
              Submit Quiz
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Quiz Results</h4>
              <p className="text-blue-800">
                You got {Object.entries(answers).filter(([i, answer]) => quiz[parseInt(i)]?.correct === answer).length} out of {quiz.length} questions correct.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={onReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              {Object.entries(answers).filter(([i, answer]) => quiz[parseInt(i)]?.correct === answer).length === quiz.length && (
                <Button onClick={() => {}} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Module
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}