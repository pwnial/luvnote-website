import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import './Counter.css';

function Number({ mv, number, height }: { mv: any; number: number; height: number }) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function Digit({ place, value, height, digitStyle }: { place: number | string; value: number; height: number; digitStyle?: React.CSSProperties }) {
  const isColon = place === ':';
  const valueRoundedToPlace = isColon ? 0 : Math.floor(value / (place as number));
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    if (!isColon) {
      animatedValue.set(valueRoundedToPlace);
    }
  }, [animatedValue, valueRoundedToPlace, isColon]);

  if (isColon) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: '0.5ch' }}>
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>:</span>
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: (number | string)[];
  gap?: number;
  textColor?: string;
  fontWeight?: number | string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientHeight?: number;
}

export default function Counter({
  value,
  fontSize = 48,
  padding = 0,
  places,
  gap = 2,
  textColor = 'inherit',
  fontWeight = 200,
  gradientFrom = '#1d2021',
  gradientTo = 'transparent',
  gradientHeight = 8,
}: CounterProps) {
  const height = fontSize + padding;

  const defaultPlaces = places || [10, 1, ':', 10, 1];

  return (
    <span className="counter-container">
      <span
        className="counter-counter"
        style={{
          fontSize,
          gap,
          color: textColor,
          fontWeight,
        }}
      >
        {defaultPlaces.map((place, i) => (
          <Digit key={i} place={place} value={value} height={height} />
        ))}
      </span>
      <span className="gradient-container">
        <span
          className="top-gradient"
          style={{
            height: gradientHeight,
            background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
          }}
        />
        <span
          className="bottom-gradient"
          style={{
            height: gradientHeight,
            background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
          }}
        />
      </span>
    </span>
  );
}
