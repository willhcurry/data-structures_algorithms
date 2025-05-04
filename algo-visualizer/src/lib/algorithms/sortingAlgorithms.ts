/**
 * Sorting Algorithms Implementation
 * 
 * This module provides implementations of common sorting algorithms with
 * step-by-step tracking for visualization purposes. Each algorithm returns
 * not just the final sorted array but a sequence of intermediate states
 * that can be used to animate and explain the sorting process.
 * 
 * The implementations prioritize clarity and educational value over
 * performance optimizations that might obscure the fundamental algorithms.
 */

/**
 * Represents a single step in the sorting process.
 * Contains the current state of the array and information about
 * which elements are being compared or swapped.
 */
export type SortStep = {
  array: number[];                // Current state of the array
  comparing: [number, number] | null;  // Indices of elements being compared, if any
  swapping: [number, number] | null;   // Indices of elements being swapped, if any
};

/**
 * Bubble Sort Implementation
 * 
 * Time Complexity: O(n²) - Quadratic time in all cases
 * Space Complexity: O(1) - Constant space (in-place sort)
 * 
 * Repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order. The pass through
 * the list is repeated until the list is sorted.
 * 
 * @param inputArray - The array to be sorted
 * @returns Array of SortSteps showing the algorithm's progress
 */
export const bubbleSort = (inputArray: number[]): SortStep[] => {
  const array = [...inputArray];
  const steps: SortStep[] = [];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Record the comparison step
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: null,
      });
      
      if (array[j] > array[j + 1]) {
        // Record the swap step
        steps.push({
          array: [...array],
          comparing: null,
          swapping: [j, j + 1],
        });
        
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        
        // Record the array after swapping
        steps.push({
          array: [...array],
          comparing: null,
          swapping: null,
        });
      }
    }
  }
  
  return steps;
};

/**
 * Quick Sort Implementation
 * 
 * Time Complexity: 
 *   - Best/Average: O(n log n)
 *   - Worst: O(n²) (rare with good pivot selection)
 * Space Complexity: O(log n) - Logarithmic space due to recursion stack
 * 
 * A divide-and-conquer algorithm that selects a 'pivot' element and
 * partitions the array around it. Elements smaller than the pivot go left,
 * larger elements go right. The sub-arrays are then recursively sorted.
 * 
 * @param inputArray - The array to be sorted
 * @returns Array of SortSteps showing the algorithm's progress
 */
export const quickSort = (inputArray: number[]): SortStep[] => {
  const array = [...inputArray];
  const steps: SortStep[] = [];
  
  const partition = (arr: number[], low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      // Record comparison
      steps.push({
        array: [...arr],
        comparing: [j, high], // Comparing current element with pivot
        swapping: null,
      });
      
      if (arr[j] <= pivot) {
        i++;
        
        // Record swap
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [i, j],
        });
        
        // Swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        // Record after swap
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: null,
        });
      }
    }
    
    // Swap pivot
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: [i + 1, high],
    });
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    // Record after pivot swap
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
    });
    
    return i + 1;
  };
  
  const quickSortHelper = (arr: number[], low: number, high: number): void => {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      quickSortHelper(arr, low, pivotIndex - 1);
      quickSortHelper(arr, pivotIndex + 1, high);
    }
  };
  
  quickSortHelper(array, 0, array.length - 1);
  return steps;
};

/**
 * Utility function to generate a random array of specified size.
 * Used to create data for sorting demonstrations.
 * 
 * @param size - The number of elements in the array
 * @param max - The maximum possible value for an element
 * @returns A random array of integers
 */
export const generateRandomArray = (size: number, max: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
};
