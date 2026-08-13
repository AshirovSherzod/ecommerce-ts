import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorFallback from "@/components/layout/ErrorFallback";
import { logError } from "@/utils/logError";

interface ErrorBoundaryProps {
  children: ReactNode;
  // Qiymati o'zgarganda boundary o'zini tiklaydi. Marshrut nomi berilsa,
  // xatodan keyin boshqa sahifaga o'tish ilovani qayta ishga tushiradi —
  // aks holda foydalanuvchi xato ekranida abadiy qolib ketardi.
  resetKey?: string;
  fullPage?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Hook varianti mavjud emas: `getDerivedStateFromError` faqat class
// komponentda ishlaydi (React 19'da ham shunday).
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  handleRetry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <ErrorFallback
        error={error}
        onRetry={this.handleRetry}
        fullPage={this.props.fullPage}
      />
    );
  }
}
