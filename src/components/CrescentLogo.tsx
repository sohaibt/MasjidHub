export function CrescentLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crescent */}
      <path
        d="M50 5C25.2 5 5 25.2 5 50s20.2 45 45 45c8.8 0 17-2.5 24-6.8C63.5 82.7 55 72 55 60c0-17.1 11.5-31.5 27.2-36C75.3 12.5 63.5 5 50 5z"
        opacity="0.95"
      />
      {/* Star */}
      <path
        d="M78 25l2.5 5.1 5.6.8-4.1 3.9 1 5.5L78 37.8l-5 2.5 1-5.5-4.1-3.9 5.6-.8z"
        opacity="0.9"
      />
    </svg>
  );
}
