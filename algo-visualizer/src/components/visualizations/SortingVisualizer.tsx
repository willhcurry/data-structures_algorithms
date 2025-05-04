/**
 * Sorting Algorithm Visualizer Component
 * 
 * This component provides an interactive visualization of common sorting algorithms
 * used in computer science. It demonstrates both the mechanics of how these algorithms
 * work and their relative performance characteristics through animated visualization.
 * 
 * Features:
 * - Step-by-step visualization of sorting algorithms
 * - Interactive controls for playback, speed, and array size
 * - Educational information about algorithm complexity and use cases
 * - Tutorial mode with detailed explanations of each step
 * 
 * Implementation notes:
 * - Uses a stateful approach to track sorting progress
 * - Pre-computes all sorting steps for smooth animation
 * - Employs color-coding to indicate comparisons and swaps
 * - Responsive design adapts to different screen sizes
 * 
 * @author Your Name
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort, quickSort, generateRandomArray, SortStep } from '../../lib/algorithms/sortingAlgorithms';

/** Defines the supported sorting algorithm types */
type AlgorithmType = 'bubble' | 'quick';

const SortingVisualizer: React.FC = () => {
  // State management for array data and visualization
  const [array, setArray] = useState<number[]>([]);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [speed, setSpeed] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [arraySize, setArraySize] = useState<number>(30);
  
  // UI state for educational features
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [tutorialMode, setTutorialMode] = useState<boolean>(false);
  
  // Reference for animation frame to allow proper cleanup
  const animationRef = useRef<number | null>(null);
  
  /**
   * Generates a new random array and resets the visualization state.
   * Wrapped in useCallback to prevent unnecessary re-renders and
   * to allow for proper dependency tracking in useEffect.
   */
  const resetArray = useCallback(() => {
    // Cancel any ongoing animations to prevent state conflicts
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Generate and set a new random array with values scaled to container height
    const newArray = generateRandomArray(arraySize, 100);
    setArray(newArray);
    setSortSteps([]);
    setCurrentStep(-1);
  }, [arraySize]);
  
  /**
   * Initiates or resumes the sorting animation.
   * Handles edge case where animation has completed by resetting to beginning.
   */
  const startSort = () => {
    if (currentStep >= sortSteps.length - 1) {
      setCurrentStep(-1);
    }
    
    setIsPlaying(true);
  };
  
  /**
   * Pauses the sorting animation without losing current progress.
   */
  const pauseSort = () => {
    setIsPlaying(false);
  };
  
  /**
   * Generates human-readable explanations for the current algorithm step.
   * Provides educational context based on the current algorithm and operation.
   * 
   * @returns {string} A descriptive explanation of the current step
   */
  const getStepExplanation = () => {
    if (currentStep < 0 || !sortSteps[currentStep]) return "";
    
    const step = sortSteps[currentStep];
    
    if (algorithm === 'bubble') {
      if (step.comparing) {
        return `Comparing elements at positions ${step.comparing[0]} and ${step.comparing[1]}, with values ${step.array[step.comparing[0]]} and ${step.array[step.comparing[1]]}.`;
      }
      if (step.swapping) {
        return `The element at position ${step.swapping[0]} (${step.array[step.swapping[0]]}) is greater than the element at position ${step.swapping[1]} (${step.array[step.swapping[1]]}), so we swap them.`;
      }
      return "Moving to the next comparison.";
    } else if (algorithm === 'quick') {
      if (step.comparing) {
        return `Comparing element ${step.array[step.comparing[0]]} with pivot ${step.array[step.comparing[1]]}.`;
      }
      if (step.swapping) {
        return `Swapping elements ${step.array[step.swapping[0]]} and ${step.array[step.swapping[1]]} to maintain partition.`;
      }
      return "Recursively processing partitions.";
    }
    
    return "";
  };
  
  /**
   * Animation loop effect that advances through sorting steps.
   * Uses setTimeout for controlled animation speed rather than requestAnimationFrame
   * to allow for better speed control.
   */
  useEffect(() => {
    if (!isPlaying || currentStep >= sortSteps.length - 1) {
      if (isPlaying && currentStep >= sortSteps.length - 1) {
        setIsPlaying(false);
      }
      return;
    }
    
    const timeout = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 1000 / speed);
    
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, sortSteps, speed]);
  
  /**
   * Recalculates sorting steps when the array or algorithm changes.
   * Pre-computes all steps for smoother animation and better UX.
   */
  useEffect(() => {
    if (array.length === 0) return;
    
    let steps: SortStep[];
    if (algorithm === 'bubble') {
      steps = bubbleSort([...array]);
    } else {
      steps = quickSort([...array]);
    }
    
    setSortSteps(steps);
    setCurrentStep(-1);
  }, [array, algorithm]);
  
  /**
   * Initializes the component with a random array on mount and when array size changes.
   */
  useEffect(() => {
    resetArray();
  }, [resetArray]);
  
  // Additional derived state and helper functions with comments...
  
  // Get current array state based on animation step
  const currentArray = currentStep >= 0 && currentStep < sortSteps.length 
    ? sortSteps[currentStep].array 
    : array;
    
  const currentComparing = currentStep >= 0 && currentStep < sortSteps.length 
    ? sortSteps[currentStep].comparing 
    : null;
    
  const currentSwapping = currentStep >= 0 && currentStep < sortSteps.length 
    ? sortSteps[currentStep].swapping 
    : null;
  
  // Determine bar color based on its state
  const getBarColor = (index: number) => {
    if (currentSwapping && (index === currentSwapping[0] || index === currentSwapping[1])) {
      return 'bg-red-500';
    }
    if (currentComparing && (index === currentComparing[0] || index === currentComparing[1])) {
      return 'bg-yellow-400';
    }
    return 'bg-blue-500';
  };
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Sorting Algorithm Visualizer</h2>
      
      {/* Introduction modal with improved styling */}
      {showIntro && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-indigo-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Welcome to Sorting Algorithm Visualizer!</h2>
            
            <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-indigo-700">What are sorting algorithms?</h3>
              <p className="text-gray-700">Sorting algorithms are methods for reorganizing a list of items into a specific order (usually ascending or descending). They&apos;re fundamental in computer science and are often asked in technical interviews.</p>
            </div>
            
            <div className="mb-6 bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-green-700">How to use this tool:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Generate a random array using the &quot;Generate New Array&quot; button</li>
                <li>Choose an algorithm (Bubble Sort or Quick Sort)</li>
                <li>Press &quot;Play&quot; to see the algorithm in action</li>
                <li>Use the speed slider to control how fast the visualization runs</li>
                <li>Step through the algorithm manually using the Previous/Next buttons</li>
              </ol>
            </div>
            
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-blue-700">Learning modes:</h3>
              <p className="mb-2"><span className="font-semibold bg-blue-100 px-2 py-1 rounded">Visual Mode:</span> Watch the algorithm run with color-coded animations</p>
              <p><span className="font-semibold bg-indigo-100 px-2 py-1 rounded">Tutorial Mode:</span> Get step-by-step explanations of what&apos;s happening</p>
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={() => setShowIntro(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
              >
                Skip Introduction
              </button>
              
              <button 
                onClick={() => {
                  setShowIntro(false);
                  setTutorialMode(true);
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Algorithm description and educational content */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-2xl font-bold text-indigo-700">
            {algorithm === 'bubble' ? 'Bubble Sort' : 'Quick Sort'}
          </h3>
          <div className="flex gap-3">
            <button 
              onClick={() => setTutorialMode(!tutorialMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tutorialMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {tutorialMode ? '📚 Tutorial Mode ON' : '📚 Tutorial Mode OFF'}
            </button>
            <button 
              onClick={() => setShowIntro(true)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              ℹ️ Show Intro
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">Time Complexity:</h4>
            <p className="text-gray-700">
              {algorithm === 'bubble' 
                ? '🐢 O(n²) - Quadratic time, inefficient for large datasets' 
                : '🚀 O(n log n) - Much more efficient than O(n²) algorithms'}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">How it works:</h4>
            <p className="text-gray-700">
              {algorithm === 'bubble' 
                ? 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.' 
                : 'Quick Sort selects a "pivot" element and partitions the array around it. Elements smaller than the pivot go to the left, larger to the right.'}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">When to use it:</h4>
            <p className="text-gray-700">
              {algorithm === 'bubble' 
                ? 'Bubble Sort is primarily used for educational purposes or for very small datasets. It&apos;s rarely used in production code.' 
                : 'Quick Sort is widely used in practice as it has good average-case performance and works well for a variety of inputs.'}
            </p>
          </div>
        </div>
        
        {/* Color legend */}
        <div className="flex flex-wrap gap-6 items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 mr-2 rounded"></div>
            <span className="text-gray-700">Unsorted elements</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-400 mr-2 rounded"></div>
            <span className="text-gray-700">Comparing elements</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 mr-2 rounded"></div>
            <span className="text-gray-700">Swapping elements</span>
          </div>
        </div>
      </div>
      
      {/* Controls section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-indigo-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Controls</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={resetArray}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Generate New Array
              </button>
              
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={startSort}
                disabled={isPlaying}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                ▶️ Play
              </button>
              
              <button 
                onClick={pauseSort}
                disabled={!isPlaying}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                ⏸️ Pause
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep <= 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                ⏮️ Previous
              </button>
              
              <button 
                onClick={() => setCurrentStep(prev => Math.min(sortSteps.length - 1, prev + 1))}
                disabled={currentStep >= sortSteps.length - 1}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                ⏭️ Next
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Array Size:</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg">{arraySize}</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Animation Speed:</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg">{speed}x</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Visualization with better styling */}
      <div className="relative mb-8 bg-white p-6 rounded-xl shadow-md overflow-hidden border border-indigo-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Visualization</h3>
        
        <div className="flex items-end h-64 gap-1 border-b border-gray-300 bg-gradient-to-b from-gray-50 to-white">
          {currentArray.map((value, index) => (
            <div
              key={index}
              className={`w-full ${getBarColor(index)} rounded-t-md transition-all duration-200 shadow-sm hover:shadow-md relative group`}
              style={{ 
                height: `${value}%`,
                transition: 'height 0.2s ease-in-out, background-color 0.2s ease'
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-1 py-0.5 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {value}
              </span>
            </div>
          ))}
        </div>
        
        {sortSteps.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Step: {currentStep + 1} / {sortSteps.length}</span>
            <div className="w-2/3 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${((currentStep + 1) / sortSteps.length) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Step explanation for tutorial mode */}
      {tutorialMode && currentStep >= 0 && (
        <div className="mt-4 p-6 bg-indigo-50 rounded-xl shadow-md border border-indigo-200">
          <h3 className="font-semibold mb-3 text-indigo-800">What&apos;s happening now:</h3>
          <p className="text-gray-700 bg-white p-3 rounded-lg shadow-inner">{getStepExplanation()}</p>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-indigo-700 font-medium">Step {currentStep + 1} of {sortSteps.length}</p>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                {Math.round((currentStep + 1) / sortSteps.length * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / sortSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;
