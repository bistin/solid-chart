import { For, splitProps } from 'solid-js';

const number = (scale) => (d) => +scale(d);

const center = (scale) => {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2;
  if (scale.round()) offset = Math.round(offset);
  return (d) => +scale(d) + offset;
};

const getLabel = (label, range, spacing) => {
  if (!label?.text || !range) return null;
  const [start, end] = range;
  return {
    text: label.text,
    x: label.x ? label.x : (start + end) / 2,
    y: label.y ? label.y : spacing + 24,
  };
}

function XAxis(props) {
  const tickSizeInner = props.tickSizeInner ?? 6;
  const tickSizeOuter = props.tickSizeOuter ?? 6;
  const tickPadding = props.tickPadding ?? 3;
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const yOffset = props.params.height;
  const [local, others] = splitProps(props, ["xScale", "xTicks"]);
  const ticks = local.xScale?.ticks?.(local.xTicks) || local.xScale?.domain?.() || null;
  const range = () => local.xScale?.range?.();
  const tickFormat = props.xTickFormat || ((x) => x);
  const tickValues = props.xTickValues;
  const values = () => (tickValues || ticks)?.map((tick, i) => ({
    value: tickFormat(tick, i),
    position: (local.xScale.bandwidth ? center : number)(local.xScale)(tick),
  }));

  const range0 =() => +range()[0] + 0.5;
  const range1 =() => +range()[range().length - 1] + 0.5;
  const k = 1;
  const baseLine = () => tickSizeOuter
    ? 'M' + range0() + ',' + k * tickSizeOuter + 'V0.5H' + range1() + 'V' + k * tickSizeOuter
    : 'M' + range0() + ',0.5H' + range1();

  const label = getLabel(props.label, range(), spacing);

  return (
    <g
      class="x axis"
      transform={`translate(0,${yOffset})`}
      fill="none"
      font-size="10"
      font-family="sans-serif"
      text-anchor="middle"
    >
      <path class="domain" stroke="currentColor" d={baseLine()}></path>
      <For each={values()}>{(tick, index) =>
        <g class="tick" opacity="1" transform={`translate(${tick.position},0)`}>
          <line stroke="currentColor" y2={tickSizeInner}></line>
          <text fill="currentColor" y={spacing} dy="0.71em">
            {tick.value}
          </text>
        </g>
      }</For>
    </g>
  );
}

export default XAxis;