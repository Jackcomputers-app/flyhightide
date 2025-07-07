import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-900">{testimonial.name}</span>
            <div className="flex items-center text-xs text-gray-500">
              <span className="capitalize">{testimonial.source}</span>
              <span className="mx-1">•</span>
              <span>{testimonial.date}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};
