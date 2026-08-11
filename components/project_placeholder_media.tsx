// Filler copy for a caption/body slot that hasn't been written yet — muted
// and bracketed so it's unmistakably a placeholder, never mistaken for real
// site copy if content lags behind the template.
export function FillerText({ children, className = "" }: { children: string; className?: string }) {
  return <p className={`text-muted ${className}`}>[{children}]</p>;
}
