import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  className = ''
}: ButtonProps) {
  const baseClass = `button button-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClass} download>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}
