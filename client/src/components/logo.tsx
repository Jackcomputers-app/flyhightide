import { cn } from '@/lib/utils';
import htaLogo from '../assets/hta-logo.webp';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  };

  return (
    <div className={cn('flex items-center', className)}>
      <img
        src={htaLogo}
        alt="High Tide Aviation"
        className={cn(sizeClasses[size])}
      />
    </div>
  );
};