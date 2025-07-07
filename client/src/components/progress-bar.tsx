import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const steps = [
    { number: 1, label: 'Location' },
    { number: 2, label: 'Tour' },
    { number: 3, label: 'Passengers' },
    { number: 4, label: 'Payment' }
  ];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step.number <= currentStep
                    ? 'bg-ocean-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:inline',
                  step.number <= currentStep
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-200 mx-2 sm:mx-4 min-w-8 sm:min-w-16">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    step.number < currentStep
                      ? 'bg-ocean-blue'
                      : 'bg-gray-200'
                  )}
                  style={{
                    width: step.number < currentStep ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
