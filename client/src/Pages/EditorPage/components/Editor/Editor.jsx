import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike'; // covers C, C++, Java
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import styles from './Editor.module.css';
import ACTIONS from '../../../../Actions';

// Map our language values to CodeMirror mode descriptors
const CM_MODES = {
  javascript: { name: 'javascript', json: true },
  cpp: { name: 'text/x-c++src' },
};

const DEFAULT_CODE = {
  javascript: `// Welcome to Coddab — Code Together in Real Time.

function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
}

greetUser('Developer');
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
};

const Editor = ({ socketRef, roomId, roomType, readOnly = false, language = 'javascript', starterCode, onCodeChange }) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    //core area ko text editor me convert
    editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
      mode: CM_MODES[language] ?? CM_MODES.javascript,
      theme: 'default',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      styleActiveLine: true, // requires addon below (we polyfill via CSS)
    });

    editorRef.current.setSize('100%', '100%');
    // Notify parent of initial code content
    if (onCodeChange) {
      onCodeChange(editorRef.current.getValue());
    }

    // instance we are getting at every event  
    editorRef.current.on('change', (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange && onCodeChange(code);
      if (origin !== 'setValue' && socketRef.current && roomType === "collab") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });

    // editorRef.current.setValue(`kkkk`);

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  // Load starterCode into editor when it arrives (e.g. Battle start)
  useEffect(() => {
    if (editorRef.current && starterCode) {
      editorRef.current.setValue(starterCode);
      if (onCodeChange) {
        onCodeChange(starterCode);
      }
    }
  }, [starterCode]);

  // Update syntax highlighting when language prop changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption('mode', CM_MODES[language] ?? CM_MODES.javascript);
    }
  }, [language]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption("readOnly", readOnly);
    }
  }, [readOnly]);

  return (
    <div className={styles.editorContainer}>
      <textarea
        ref={textareaRef}
        defaultValue={DEFAULT_CODE[language] ?? DEFAULT_CODE.javascript}
      />
    </div>
  );
};

export default Editor;
