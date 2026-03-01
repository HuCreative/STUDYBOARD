export default function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-accent text-white flex items-center justify-center font-mono font-bold border-2 border-white shadow-sm`}>
      {initials}
    </div>
  );
}
