import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';

const App = () => {
  const editorRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'monaco-demo', ydoc);
    const ytext = ydoc.getText('monaco');

    provider.awareness.setLocalStateField('user', {
      name: `User${Math.floor(Math.random() * 100)}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });

    provider.on('status', ({ status }) => {
      setIsConnected(status === 'connected');
    });

    provider.awareness.on('change', () => {
      const users = Array.from(provider.awareness.getStates().values());
      setUsers(users);
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'monaco-demo', ydoc);
    const ytext = ydoc.getText('monaco');
    
    new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1>Collaborative Code Editor</h1>
        <div className="text-sm">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className="flex gap-2">
          {users.map((user: any, i: number) => (
            <div key={i} style={{color: user.user?.color}}>
              {user.user?.name}
            </div>
          ))}
        </div>
      </header>
      <main className="flex-1">
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// Start coding here..."
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            automaticLayout: true
          }}
        />
      </main>
    </div>
  );
};

export default App;
