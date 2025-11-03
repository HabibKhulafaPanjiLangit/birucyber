import { CSSProperties, ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ResponsiveContainer({ children, className = '', style = {} }: ResponsiveContainerProps) {
  const baseStyle: CSSProperties = {
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden',
    ...style
  };

  return (
    <div className={`responsive-container ${className}`} style={baseStyle}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ children, columns = 3, gap = '1rem', className = '' }: ResponsiveGridProps) {
  const style: CSSProperties = {
    display: 'grid',
    gap,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const gridClass = `grid-${columns} ${className}`;

  return (
    <div className={gridClass} style={style}>
      {children}
    </div>
  );
}

interface ResponsiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

export function ResponsiveButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  style = {}
}: ResponsiveButtonProps) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 255, 0.2))',
      border: '2px solid',
      borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
      color: '#00ffff',
    },
    secondary: {
      background: 'rgba(0, 0, 0, 0.5)',
      border: '2px solid #00ff00',
      color: '#00ff00',
    },
    danger: {
      background: 'rgba(255, 0, 0, 0.2)',
      border: '2px solid #ff0000',
      color: '#ff0000',
    },
  };

  const baseStyle: CSSProperties = {
    padding: '1rem 2rem',
    fontSize: '0.9rem',
    fontFamily: 'Courier New, monospace',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    ...variants[variant],
    ...style,
  };

  return (
    <button 
      type={type}
      className="btn"
      style={baseStyle} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Hook imports
import { useState, useEffect } from 'react';

// Responsive breakpoints
export const breakpoints = {
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)',
} as const;
