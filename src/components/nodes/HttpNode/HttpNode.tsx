import { Handle, NodeResizer, NodeToolbar, Position } from "@xyflow/react";

export default function HttpNode({ data, selected }: any) {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={data.toolbarPosition}
      >
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar>

      <div style={{ padding: "10px 20px" }}>{data.label}</div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
