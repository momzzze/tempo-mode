import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'minimal' | 'halo';
}

const Timer = React.forwardRef<HTMLDivElement, TimerProps>(
  ({ className, variant = 'minimal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative text-center',
          variant === 'minimal' &&
            'bg-neutral-900/50 border border-white/10 rounded-2xl backdrop-blur-xl p-8 max-w-[600px]',
          variant === 'halo' && 'bg-transparent max-w-[800px] mx-auto p-6',
          className
        )}
        {...props}
      />
    );
  }
);
Timer.displayName = 'Timer';

const TimerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('absolute top-4 right-4 flex gap-2 z-10', className)}
    {...props}
  />
));
TimerHeader.displayName = 'TimerHeader';

const TimerModeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mb-8', className)} {...props} />
));
TimerModeSelector.displayName = 'TimerModeSelector';

export interface TimerDigitsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'minimal' | 'halo';
  isRunning?: boolean;
}

const TimerDigits = React.forwardRef<HTMLDivElement, TimerDigitsProps>(
  ({ className, variant = 'minimal', isRunning, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'font-bold tracking-wider mb-6 transition-all duration-300',
        variant === 'minimal' && 'text-[80px] text-neutral-400',
        variant === 'halo' &&
          'text-[clamp(96px,18vw,200px)] text-white/95 drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        isRunning &&
          variant === 'minimal' &&
          'text-green-400 drop-shadow-[0_0_8px_rgba(51,255,136,0.25)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TimerDigits.displayName = 'TimerDigits';

const TimerControls = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex gap-3 justify-center flex-wrap', className)}
    {...props}
  />
));
TimerControls.displayName = 'TimerControls';

export interface TimerRingProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimerRing = React.forwardRef<HTMLDivElement, TimerRingProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[min(88vw,720px)] aspect-square',
        'rounded-full border-[14px] border-white/30',
        'shadow-[0_0_0_8px_rgba(255,255,255,0.08),0_0_80px_rgba(0,0,0,0.35)]',
        'pointer-events-none z-0',
        'after:content-[""] after:absolute after:inset-[12%]',
        'after:rounded-full after:border after:border-white/12',
        className
      )}
      {...props}
    >
      <span className="absolute w-[18px] h-[18px] rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.6)] bottom-4 left-4" />
      <span className="absolute w-[18px] h-[18px] rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.6)] bottom-4 right-4" />
    </div>
  )
);
TimerRing.displayName = 'TimerRing';

const TimerTaskInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'minimal' | 'halo' }
>(({ className, variant = 'minimal', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-6',
      variant === 'minimal' && 'pt-4 border-t border-white/10',
      variant === 'halo' && 'w-[min(520px,90vw)] text-center mt-4 pt-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TimerTaskInput.displayName = 'TimerTaskInput';

export {
  Timer,
  TimerHeader,
  TimerModeSelector,
  TimerDigits,
  TimerControls,
  TimerRing,
  TimerTaskInput,
};
