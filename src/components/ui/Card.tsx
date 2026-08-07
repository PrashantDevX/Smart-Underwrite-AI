import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, gradient = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6',
          glass && 'glass-card',
          gradient && 'gradient-card',
          !glass && !gradient && 'bg-white border border-gray-200 shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
