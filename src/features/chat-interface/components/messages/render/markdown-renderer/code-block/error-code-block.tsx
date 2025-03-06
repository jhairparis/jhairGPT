import React from "react";
import Lowlight from "react-lowlight";

class ErrorBoundaryCode extends React.Component<
  { children: React.ReactNode; value: string },
  { hasError: boolean }
> {
  value: string;
  constructor(props: { children: React.ReactNode; value: string }) {
    super(props);
    this.state = { hasError: false };
    this.value = props.value;
  }
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <Lowlight value={this.value} language="plaintext" markers={[]} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundaryCode;
