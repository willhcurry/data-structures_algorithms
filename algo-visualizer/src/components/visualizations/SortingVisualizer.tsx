import React, { useState, useEffect, useRef } from 'react';
import { bubbleSort, quickSort, generateRandomArray, SortStep } from '../../lib/algorithms/sortingAlgorithms';

type AlgorithmType = 'bubble' | 'quick';

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [speed, setSpeed] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [arraySize, setArraySize] = useState<number>(30);
  
  const animationRef = useRef<number | null>(null);
  
  // Generate new random array
  const resetArray = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const newArray = generateRandomArray(arraySize, 100);
    setArray(newArray);
    setSortSteps([]);
    setCurrentStep(-1);
  };
  
  // Start sorting animation
  const startSort = () => {
    if (currentStep >= sortSteps.length - 1) {
      setCurrentStep(-1);
    }
    
    setIsPlaying(true);
  };
  
  // Pause sorting animation
  const pauseSort = () => {
    setIsPlaying(false);
  };
  
  // Run animation loop
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
  
  // Calculate sort steps when algorithm changes
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
  
  // Initialize with a random array
  useEffect(() => {
    resetArray();
  }, [arraySize]);
  
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sorting Algorithm Visualizer</h2>
      
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <button 
            onClick={resetArray}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate New Array
          </button>
          
          <select 
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            className="px-4 py-2 border rounded"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
          
          <div className="flex items-center gap-2">
            <label>Size:</label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-32"
            />
            <span>{arraySize}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label>Speed:</label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={startSort}
            disabled={isPlaying}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Play
          </button>
          
          <button 
            onClick={pauseSort}
            disabled={!isPlaying}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Pause
          </button>
          
          <button 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep <= 0}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Previous Step
          </button>
          
          <button 
            onClick={() => setCurrentStep(prev => Math.min(sortSteps.length - 1, prev + 1))}
            disabled={currentStep >= sortSteps.length - 1}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Next Step
          </button>
        </div>
      </div>
      
      <div className="flex items-end h-64 gap-1 border-b border-gray-300">
        {currentArray.map((value, index) => (
          <div
            key={index}
            className={`w-full ${getBarColor(index)}`}
            style={{ 
              height: `${value}%`,
              transition: 'height 0.1s ease-in-out'
            }}
          />
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-sm">
          {algorithm === 'bubble' 
            ? 'Bubble Sort: O(n²) - Simple but inefficient algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
            : 'Quick Sort: O(n log n) - An efficient, divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around the pivot.'}
        </p>
        
        {sortSteps.length > 0 && (
          <p className="mt-2">
            Steps: {currentStep + 1} / {sortSteps.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default SortingVisualizer;
