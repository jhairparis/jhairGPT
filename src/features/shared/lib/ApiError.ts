export class ApiError extends Error {
  status: number;
  messageDebug: string;

  constructor({
    message,
    messageDebug,
    status,
  }: {
    messageDebug: string;
    message: string;
    status: number;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.messageDebug = messageDebug;
  }
}
