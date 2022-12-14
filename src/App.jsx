import { createSignal, createEffect, createMemo } from 'solid-js';
import styles from './App.module.css';
import ChartBase from './ChartBase';
import XAxis from './XAxis';
import YAxis from './YAxis';
import GraphPath from './GraphPath';
import { scaleLinear } from 'd3-scale';

const data2 = [
  { x: 0, y0: 1, y1: 1 },
  { x: 1, y0: 1, y1: 5 },
  { x: 2, y0: 1, y1: 2 },
  { x: 3, y0: 1, y1: 4 },
  { x: 4, y0: 1, y1: 3 },
  { x: 5, y0: 1, y1: 6 },
  { x: 6, y0: 2, y1: 8 },
  { x: 7, y0: 5, y1: 10 },
  { x: 8, y0: 5, y1: 12 },
  { x: 9, y0: 5, y1: 16 },
  { x: 10, y0: 6, y1: 14 },
];
const data = data2.map((d) => d.y1);

function App() {
  const [width, setWidth] = createSignal(600);
  const [height, setHeight] = createSignal(200);
  const margin = { top: 10, right: 30, bottom: 30, left: 50 };
  const transform = { x: 0, y: 0, k: 1 };

  const innerWidth = () => width() - margin.left - margin.right;
  const innerHeight =  () => height() - margin.top - margin.bottom;

  const xScale = createMemo(() => {
    return scaleLinear()
      .domain([0, data.length - 1]) // input
      .range([0 + transform.x, (innerWidth()) * transform.k + transform.x]);
  });

  const yScale = createMemo(() => {
    return scaleLinear()
      .domain([Math.min(...data), Math.max(...data)]) // input
      .range([innerHeight(), 0]); // output
  });
  const params = () => ({ width: (innerWidth()), height: innerHeight(), className: "temp" });

  const scale = () => ({xScale: xScale(), yScale: yScale()});

  const defined = (r, i) => { return i != 3 && i != 7;};

  return (

    <div class={styles.App}>
      <button onClick={() => setWidth((w) => w + 10)} >wider</button>
      <button onClick={() => setHeight((h) => h + 10)} >taller</button>
      <ChartBase
        width={width()}
        height={height()}
        margin={margin}>
        <XAxis params={params()} xScale={xScale()} />
        <YAxis params={params()} yScale={yScale()} />
        <YAxis params={params()} yScale={yScale()} orient="right" />

        <GraphPath
          stroke="#ff0000"
          stroke-width="2"
          fill="none"

          defined={defined}
          xKey="x"
          yKey="y1"
          scale={scale()}
          data={data2}
        />

      </ChartBase>

    </div >
  );
}

export default App;
