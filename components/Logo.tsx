export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="10" fill="#0d0d1a" />

      {/* Outer hex ring */}
      <path
        d="M20 5 L33 12.5 L33 27.5 L20 35 L7 27.5 L7 12.5 Z"
        stroke="url(#lg1)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.4"
      />

      {/* Inner geometric — lightning bolt */}
      <path
        d="M22 9 L14 21 L20 21 L18 31 L26 19 L20 19 Z"
        fill="url(#lg1)"
      />

      {/* Glow dot top-right */}
      <circle cx="30" cy="10" r="2" fill="#06b6d4" opacity="0.8" />
      <circle cx="30" cy="10" r="4" fill="#06b6d4" opacity="0.15" />
    </svg>
  )
}
