import { splitProps } from 'solid-js';

export const isValid = (x) => x === 0 || x;

const defaultScale = (x) => x;
function GraphPath(props) {
  const [local, attrs] = splitProps(props, ['data', 'closePath', 'xKey', 'yKey', 'defined', 'scale', 'offset']);

  const d = () => {
    const { data, closePath, xKey, yKey, defined, scale = {}, offset } = local;
    if (!data || !data.length || !xKey || !yKey) return '';
    const { xScale = defaultScale, yScale = defaultScale } = scale;
    const applyOffset = offset || 0;
    const d = data.map((r, i, array) => {
      const x = xScale(r[xKey]) + applyOffset;
      const y = yScale(r[yKey]);
      if (!isValid(x) || !isValid(y)) return false;

      const point = `${x},${y}`;
      const type =
            i === 0 || (defined && (!defined(r, i) || !defined(array[i - 1], i - 1)))
            ? 'M'
            : 'L';
      return `${type}${point}`;
    });
    return `${d.filter(Boolean).join('')}${closePath ? 'Z' : ''}`;
  };

  return <path d={d()} {...attrs}></path>;

}

export default GraphPath;
