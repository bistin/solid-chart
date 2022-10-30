import { children } from "solid-js";

function ChartBase(props) {
    const c = children(() => props.children);
    return (
        <svg class="my" width={props.width} height={props.height}>
            <g transform={`translate(${props.margin.left},${props.margin.top})`}>
                {c()}
            </g>
        </svg >
    );
}

export default ChartBase;


