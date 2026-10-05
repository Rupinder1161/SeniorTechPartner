type UnauthorizedHandler = () => void;
let handler: UnauthorizedHandler | undefined;

export function setUnauthorizedHandler(next?: UnauthorizedHandler): void {
  handler = next;
}

export function notifyUnauthorized(): void {
  handler?.();
}