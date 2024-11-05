if (typeof window !== 'undefined') {
  const darkMode = localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && 
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }
} 