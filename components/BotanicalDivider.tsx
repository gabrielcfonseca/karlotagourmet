'use client'

interface BotanicalDividerProps {
  className?: string
  opacity?: number
  flip?: boolean
}

export default function BotanicalDivider({ className = '', opacity = 0.07, flip = false }: BotanicalDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden pointer-events-none ${className}`}
      style={{ opacity, transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Palm leaf left */}
        <path d="M-20 80 Q80 20 160 40 Q200 50 180 70 Q140 30 60 60 Q20 75 -20 80Z" fill="#5C4033" />
        <path d="M0 90 Q60 30 120 55 Q155 68 135 82" stroke="#5C4033" strokeWidth="1.5" fill="none" />

        {/* Bird of paradise center-left */}
        <path d="M300 90 Q340 10 400 35 Q430 48 410 65 Q380 25 330 55 Q315 68 300 90Z" fill="#C9A84C" />
        <path d="M320 90 Q360 20 410 45" stroke="#C9A84C" strokeWidth="1" fill="none" />

        {/* Cactus/tropical center */}
        <path d="M650 80 Q680 30 720 50 Q745 62 730 75" stroke="#5C4033" strokeWidth="2" fill="none" />
        <path d="M720 50 Q760 20 790 40 Q805 50 795 60" stroke="#5C4033" strokeWidth="2" fill="none" />
        <path d="M680 80 L680 50" stroke="#5C4033" strokeWidth="2" />

        {/* Palm leaf right-center */}
        <path d="M900 90 Q960 15 1030 38 Q1060 50 1040 68 Q1000 28 940 58 Q920 72 900 90Z" fill="#5C4033" />
        <path d="M920 90 Q975 25 1040 48" stroke="#5C4033" strokeWidth="1" fill="none" />

        {/* Flower right */}
        <circle cx="1200" cy="45" r="8" fill="#C9A84C" />
        <path d="M1200 37 Q1210 28 1218 35" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        <path d="M1200 37 Q1190 28 1182 35" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        <path d="M1208 45 Q1220 38 1222 48" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        <path d="M1192 45 Q1180 38 1178 48" stroke="#C9A84C" strokeWidth="1.5" fill="none" />

        {/* Palm leaf far right */}
        <path d="M1360 90 Q1400 20 1460 38 Q1490 50 1475 68" stroke="#5C4033" strokeWidth="1.5" fill="none" />
        <path d="M1380 90 Q1440 15 1510 35 Q1540 48 1525 65" fill="#5C4033" opacity="0.6" />
      </svg>
    </div>
  )
}

// Full-section botanical overlay (absolute positioned, fills container)
export function BotanicalOverlay({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Large palm leaves scattered */}
        <path d="M-60 200 Q100 50 280 120 Q340 145 310 190 Q240 90 80 150 Q20 175 -60 200Z" fill="#5C4033" />
        <path d="M-40 250 Q80 100 220 160 Q270 185 250 220" stroke="#5C4033" strokeWidth="2" fill="none" />

        <path d="M1300 100 Q1420 -50 1560 30 Q1610 55 1585 100 Q1510 10 1380 70 Q1340 88 1300 100Z" fill="#5C4033" />

        {/* Birds of paradise */}
        <path d="M600 -20 Q680 80 720 200 Q730 240 710 260" stroke="#C9A84C" strokeWidth="2.5" fill="none" />
        <path d="M720 200 Q800 160 850 200" stroke="#C9A84C" strokeWidth="2" fill="none" />
        <path d="M720 200 Q780 250 820 240" stroke="#C9A84C" strokeWidth="2" fill="none" />

        {/* Bottom left botanical */}
        <path d="M0 750 Q120 600 240 660 Q290 680 275 720 Q220 640 110 690 Q50 715 0 750Z" fill="#5C4033" />
        <path d="M20 800 Q130 640 250 700" stroke="#5C4033" strokeWidth="1.5" fill="none" />

        {/* Bottom right botanical */}
        <path d="M1200 800 Q1320 650 1440 700 Q1480 720 1465 755" stroke="#C9A84C" strokeWidth="2" fill="none" />
        <path d="M1350 750 Q1420 680 1490 710 Q1520 725 1508 755" fill="#C9A84C" opacity="0.5" />

        {/* Scattered small leaves */}
        <ellipse cx="400" cy="400" rx="20" ry="60" transform="rotate(-30 400 400)" fill="#5C4033" opacity="0.4" />
        <ellipse cx="1050" cy="500" rx="15" ry="50" transform="rotate(20 1050 500)" fill="#C9A84C" opacity="0.3" />
        <ellipse cx="200" cy="550" rx="12" ry="40" transform="rotate(-45 200 550)" fill="#5C4033" opacity="0.3" />
      </svg>
    </div>
  )
}
