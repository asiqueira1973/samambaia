import Svg, { G, Path } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * A folha de samambaia do ícone do app, desenhada com a mesma geometria do
 * mockup (`telas-do-app-samambaia/project/Icone Samambaia.dc.html`): um caule
 * e cinco pares de folíolos que encurtam conforme sobem.
 */
const FROND_PAIRS = 5;

function fronds() {
  const paths: { d: string; width: number }[] = [];

  for (let i = 0; i < FROND_PAIRS; i += 1) {
    const t = i / (FROND_PAIRS - 1);
    const y = 790 - t * 540;
    const x = 512;
    const length = 280 * (1 - t * 0.62);
    const lift = length * 0.6;
    const width = 52 - t * 8;

    for (const side of [-1, 1]) {
      const endX = x + side * length;
      const endY = y - lift;
      const c1x = x + side * length * 0.35;
      const c1y = y - lift * 0.05;
      const c2x = x + side * length * 0.8;
      const c2y = y - lift * 0.45;
      paths.push({ d: `M ${x} ${y} C ${c1x} ${c1y} ${c2x} ${c2y} ${endX} ${endY}`, width });
    }
  }

  return paths;
}

const FRONDS = fronds();

type Props = {
  size: number;
  color?: string;
};

export function FernMark({ size, color = colors.green }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <G transform="translate(41 -19) scale(0.92)">
        <Path
          d="M512 872 C 500 640 505 420 512 176"
          fill="none"
          stroke={color}
          strokeWidth={52}
          strokeLinecap="round"
        />
        {FRONDS.map((frond, index) => (
          <Path
            key={index}
            d={frond.d}
            fill="none"
            stroke={color}
            strokeWidth={frond.width}
            strokeLinecap="round"
          />
        ))}
      </G>
    </Svg>
  );
}
