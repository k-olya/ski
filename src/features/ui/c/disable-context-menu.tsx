import { useEffect } from 'react';

export const DisableContextMenu = () => {
  useEffect(() => {
    // Function to prevent context menu
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners for both contextmenu and touch events (for mobile long press)
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      // Clean up event listeners when component unmounts
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return null;
};
