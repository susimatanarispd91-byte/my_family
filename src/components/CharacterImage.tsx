import { useState } from 'react';
import { User } from 'lucide-react';

interface CharacterImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function CharacterImage({ src, alt, className = '', fallbackLabel }: CharacterImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-pink-50 to-amber-100 text-slate-700 ${className}`}
        role="img"
        aria-label={alt}
      >
        <User className="h-12 w-12 text-sky-600" />
        {fallbackLabel && (
          <span className="mt-2 font-display text-base font-bold">{fallbackLabel}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
