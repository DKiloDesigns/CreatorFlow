interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    const message = options.title 
      ? `${options.title}: ${options.description || ''}`
      : options.description || '';
    
    if (options.variant === 'destructive') {
      console.error(message);
    } else {
      console.log(message);
    }
    
    // For now, use alert as a simple fallback
    // In a real implementation, this would use a proper toast library
    alert(message);
  };

  return { toast };
} 