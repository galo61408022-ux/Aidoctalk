export function LoadingSpinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  return (
    <div className={`${sizeClass} border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin`} />
  );
}
