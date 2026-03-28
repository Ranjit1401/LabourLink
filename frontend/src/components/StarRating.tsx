import { useState } from 'react';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({
  initialRating = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = true,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const btnSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';

  const handleClick = (star: number) => {
    if (readOnly) return;
    setRating(star);
    onChange?.(star);
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map(star => {
        const isFilled = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            className={`${btnSize} flex items-center justify-center rounded-xl transition-all ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${isFilled ? 'text-primary' : 'text-outline-variant'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            <span
              className={`material-symbols-outlined ${sizeClass}`}
              style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        );
      })}
      {showValue && rating > 0 && (
        <span className="ml-2 font-headline font-extrabold text-xl text-primary">
          {(hover || rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
