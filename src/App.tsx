import "./App.css";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  ReactFlowInstance,
  ReactFlowProvider,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Avatar, Card, List, Input } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { NodeData } from "./types";
import HttpNode from "./components/nodes/HttpNode/HttpNode";
import HttpNodeProperties from "./components/nodes/HttpNode/HttpNodeProperties";

const initialNodes: Node<NodeData>[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" }, resizing: true },
  { id: "2", position: { x: 200, y: 100 }, data: { label: "2" } },
  { id: "3", type: "http", position: { x: 500, y: 100 }, data: { label: "3" } },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "step",
    label: "Hello, World!",
  },
  { id: "e2-3", source: "2", target: "3", type: "step" },
];

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 5",
  },
  {
    title: "Ant Design Title 6",
  },
  {
    title: "Ant Design Title 7",
  },
  {
    title: "Ant Design Title 8",
  },
  {
    title: "Ant Design Title 9",
  },
  {
    title: "Ant Design Title 10",
  },
  {
    title: "Ant Design Title 11",
  },
  {
    title: "Ant Design Title 12",
  },
  {
    title: "Ant Design Title 13",
  },
  {
    title: "Ant Design Title 14",
  },
  {
    title: "Ant Design Title 15",
  },
  {
    title: "Ant Design Title 16",
  },
  {
    title: "Ant Design Title 17",
  },
  {
    title: "Ant Design Title 18",
  },
  {
    title: "Ant Design Title 19",
  },
  {
    title: "Ant Design Title 20",
  },
];

const nodeTypes = { http: HttpNode };
const nodeProperties: Record<string, any> = {
  http: HttpNodeProperties,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Node<NodeData>,
    Edge
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const onNodeLabelChange = (newLabel: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        }
        return node;
      })
    );
    setSelectedNode((prev) =>
      prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null
    );
  };

  // Handle drag start
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Handle drop into the flow canvas
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");

    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: Node<NodeData> = {
      id: `${nodes.length + 1}`,
      position,
      data: { label: type },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div ref={reactFlowWrapper} style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow<Node<NodeData>, Edge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView={true}
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
          onInit={setReactFlowInstance}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        >
          <Panel position="top-left">
            <Card
              title="Components"
              variant="borderless"
              style={{ width: 300, height: "95vh" }}
            >
              <List
                style={{ overflow: "auto", maxHeight: "85vh" }}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                        />
                      }
                      title={
                        <div
                          draggable
                          onDragStart={(event) =>
                            onDragStart(event, item.title)
                          }
                          style={{ cursor: "grab", userSelect: "none" }}
                        >
                          {item.title}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Panel>
          <Panel position="top-right">
            <Card
              title={selectedNode ? `Node Properties: #${selectedNode.id}` : "Flow Properties"}
              variant="borderless"
              style={{ width: 300, height: "95vh" }}
            >
              {selectedNode ? (
                (nodeProperties[selectedNode.type!] &&
                  React.createElement(nodeProperties[selectedNode.type!])) || (
                  <div>
                    <label>Node Name:</label>
                    <Input
                      value={selectedNode.data.label}
                      onChange={(e) => onNodeLabelChange(e.target.value)}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                )
              ) : (
                <p>Select a node to edit its properties</p>
              )}
            </Card>
          </Panel>
          <Controls position="bottom-center" orientation="horizontal" />
          <MiniMap position="top-right" style={{ marginRight: 350 }} />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            bgColor="#f0f2f5"
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
