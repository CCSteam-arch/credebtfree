import React from "react";
import { app, analytics } from "./firebase"; // <- Firebase import
import { firebaseConfig } from "./firebase";

function App() {
  console.log("Firebase config:", firebaseConfig); // remove after verifying
  return (
    <div>
      <h1>Credit Comeback Simulator</h1>
      <p>This is your main app container.</p>
    </div>
  );
}

export default App;
