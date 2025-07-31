import React from 'react';
import Svg, { Path } from 'react-native-svg';
import iconPaths from './icons.json';

export const SvgIcon = ({ name, outline = true, size = 24, color = 'black', strokeWidth = 1.5, opacity = 1 }) => {
  let paths = outline ? iconPaths[`${name}-outline`] : iconPaths[name];

  if (!paths || paths.length === 0) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  if (typeof paths === 'string') {
    paths = [paths]
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map((d, index) => (
        <Path
          key={index}
          d={d}
          fill={outline ? 'none' : color}
          stroke={outline ? color : 'none'}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

      ))}
    </Svg>
  );
};
