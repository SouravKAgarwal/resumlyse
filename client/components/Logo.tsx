import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const ResumlyseLogo: React.FC<LogoProps> = ({ className = "w-8 h-8", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="resumlyse logo"
    >
      {/* Background container */}
      <rect width="28" height="28" rx="7" fill="#1c1917" />

      {/* Document outline with folded corner */}
      <path
        d="M8.5 7.5C8.5 6.94772 8.94772 6.5 9.5 6.5H14.5L19.5 11.5V20.5C19.5 21.0523 19.0523 21.5 18.5 21.5H9.5C8.94772 21.5 8.5 21.0523 8.5 20.5V7.5Z"
        stroke="#fafaf9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 6.5V11.5H19.5"
        stroke="#fafaf9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Analysis lines */}
      <path
        d="M11.5 14.5H16.5"
        stroke="#fafaf9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 17.5H14.5"
        stroke="#fafaf9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Verification status pip */}
      <circle cx="17" cy="17.5" r="1.1" fill="#15803d" />
    </svg>
  );
};
