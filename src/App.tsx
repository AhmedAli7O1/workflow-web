import './App.css';
import { 
  addEdge, Background, 
  BackgroundVariant, Controls, 
  MiniMap, Panel, ReactFlow, 
  useEdgesState, useNodesState,
  Node, Edge, Connection, XYPosition,
  ReactFlowInstance, ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Avatar, Card, List, Input } from 'antd';
import { useCallback, useRef, useState } from 'react';

type CustomNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
};

type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
};

const initialNodes: CustomNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 500, y: 100 }, data: { label: '3' } },
];

const initialEdges: CustomEdge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'step', label: 'Hello, World!' },
  { id: 'e2-3', source: '2', target: '3', type: 'step' },
];

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
  {
    title: 'Ant Design Title 7',
  },
  {
    title: 'Ant Design Title 8',
  },
  {
    title: 'Ant Design Title 9',
  },
  {
    title: 'Ant Design Title 10',
  },
  {
    title: 'Ant Design Title 11',
  },
  {
    title: 'Ant Design Title 12',
  },
  {
    title: 'Ant Design Title 13',
  },
  {
    title: 'Ant Design Title 14',
  },
  {
    title: 'Ant Design Title 15',
  },
  {
    title: 'Ant Design Title 16',
  },
  {
    title: 'Ant Design Title 17',
  },
  {
    title: 'Ant Design Title 18',
  },
  {
    title: 'Ant Design Title 19',
  },
  {
    title: 'Ant Design Title 20',
  }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<CustomNode, CustomEdge> | null>(null);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);

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
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null);
  };

  // Handle drag start
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle drop into the flow canvas
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: CustomNode = {
      id: `${nodes.length + 1}`,
      position,
      data: { label: type },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow<CustomNode, CustomEdge>
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
        >
          <Panel position="top-left">
            <Card title="Components" variant="borderless" style={{ width: 250 }}>
              <List
                style={{overflow: 'auto', maxHeight: '70vh'}}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                      title={
                        <div
                          draggable
                          onDragStart={(event) => onDragStart(event, item.title)}
                          style={{ cursor: 'grab', userSelect: 'none' }}
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
            <Card title="Node Properties" variant="borderless" style={{ width: 300 }}>
              {selectedNode ? (
                <div>
                  <label>Node Name:</label>
                  <Input
                    value={selectedNode.data.label}
                    onChange={(e) => onNodeLabelChange(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
              ) : (
                <p>Select a node to edit its properties</p>
              )}
            </Card>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} bgColor='#f0f2f5' />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}