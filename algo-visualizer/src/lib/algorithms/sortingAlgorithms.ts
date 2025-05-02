export type SortStep = {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
};

// Bubble Sort with animation steps
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

// Quick Sort with animation steps
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

// Generate random array
export const generateRandomArray = (size: number, max: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
};
