function handleGlobalError(event: ErrorEvent) {
  // eslint-disable-next-line no-console
  console.error('Global error captured:', event.error || event.message, event);
  try {
    // Show a simple user-facing message
    // Avoid using UI libraries here; alert is simple and reliable in dev
    alert(`An unexpected error occurred: ${event.message || event.error}`);
  } catch (e) {
    // ignore
  }
}

function handleRejection(event: PromiseRejectionEvent) {
  // eslint-disable-next-line no-console
  console.warn('Unhandled promise rejection:', event.reason);
  try {
    alert(`Unhandled promise rejection: ${String(event.reason).slice(0, 200)}`);
  } catch (e) {
    // ignore
  }
}

export function registerGlobalErrorHandlers() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection as any);
  }
}
