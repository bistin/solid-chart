import { For, splitProps } from 'solid-js';

const number = (scale) => (d) => +scale(d);

const center = (scale) => {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2;
  if (scale.round()) offset = Math.round(offset);
  return (d) => +scale(d) + offset;
};

const getLabel = (label, customRange, axisRange, textX, values, orient) => {
  const range = axisRange || customRange;
  if (!label?.text || !range) return null;
  const [start, end] = range;
  const maxLen = values.reduce((a, b) => Math.max(a, `${b.value}`.length), 0);
  return {
      text: label.text,
      x: label.x ? label.x : (maxLen * 8 + 6) * (orient === 'right' ? 1 : -1) + textX,
      y: label.y ? label.y : (start + end) / 2,
  };
}

function YAxis(props) {
  const orient = props.orient ?? 'left';
  const tickSizeInner = props.tickSizeInner ?? 6;
  const tickSizeOuter = props.tickSizeOuter ?? 6;
  const tickPadding = props.tickPadding ?? 3;

  const [local] = splitProps(props, ["yScale", "yTicks"]);
  const ticks = local.yScale?.ticks?.(local.yTicks) || local.yScale?.domain?.() || null;
  const range = () => local.yScale?.range?.();
  const tickFormat = props.yTickFormat || ((x) => x);
  const tickValues = props.yTickValues;
  const hintValue = props.hintValue || null;
  const values = () => (tickValues || ticks)?.map((tick, i, array) => ({
    value: tickFormat(tick, i, array),
    position: (local.yScale.bandwidth ? center : number)(local.yScale)(tick),
    hint: tickFormat(tick, i, array) === tickFormat(hintValue),
  })) || [];
  
  const translateX = (orient === 'right' && props.params.width) ?  props.params.width : 0;
  const x2 = (orient === 'left' ? -1 : 1) * tickSizeInner;
  const textAnchor = (orient === 'right')  ? 'start' : 'end';
  const textX = (orient === 'left' ? -1 : 1) * (Math.max(tickSizeInner, 0) + tickPadding);
  

  const range0 =() => +range()[0] + 0.5;
  const range1 =() => +range()[range().length - 1] + 0.5;
  const k = orient === 'left' ? -1 : 1;

  const baseLine = () => tickSizeOuter
  ? 'M' + k * tickSizeOuter + ',' + range0() + 'H0.5V' + range1() + 'H' + k * tickSizeOuter
  : 'M0.5,' + range0() + 'V' + range1();
  
  
 
   

  const label = getLabel (label, customRange, axisRange, textX, values, orient)

  return (
    <g
    class="y axis"
    transform={`translate(${translateX}, 0)`}
    fill="none"
    font-size="10"
    font-family="sans-serif"
    text-anchor={textAnchor}
   
    >
    <path class="domain" d={baseLine}></path>
    <For each={values()}>{(tick) =>
        <g class="tick" opacity="1" transform="translate(0,{{tick.position}})">
            {{#unless @hideLine}}
                <line x2={x2}></line>
            {{/unless}}

            {{#unless @hideText}}
                
              <text x={textX} dy="0.32em" class={{if tick.hint "hint-text" ""}}>
                  {tick.value}
              </text>
            {{/unless}}
        </g>
    }</For>

    {{#if this.label}}
        <text
            x={label.x}
            y={label.y}
            fill="currentColor"
            text-anchor="middle"
            style="writing-mode:tb"
        >
            {label.text}
        </text>
    {{/if}}
</g>
  );
}

export default YAxis;