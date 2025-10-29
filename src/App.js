import React from "react";
import { app as firebaseApp, firebaseConfig } from "./firebase"; // <- Firebase import

function App() {
  // temporary debug
  // eslint-disable-next-line no-console
  console.log("Firebase app:", firebaseApp?.options || firebaseApp, "config:", firebaseConfig);
  return (
    <div>
      <h1>Credit Comeback Simulator</h1>
      <p>This is your main app container.</p>
    </div>
  );
}

export default App;
