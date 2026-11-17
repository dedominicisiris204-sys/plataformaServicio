import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Protección contra errores DOM removeChild / insertBefore provocados por traductores o extensiones del navegador
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return this.appendChild(newNode);
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retryKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("Recuperando vista automáticamente:", error);
    setTimeout(() => {
      this.setState((prev) => ({ hasError: false, retryKey: prev.retryKey + 1 }));
    }, 50);
  }

  render() {
    return <App key={this.state.retryKey} />;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <RootErrorBoundary />
);
