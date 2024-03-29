export interface FuncStatus {
  funcId: string;
  funcName: string;
  invoked: string;
  lastUpdate: string;
  status: "completed" | "error" | "running";
}

export interface EventFiredLog {
  timestamp: string;
  meta: {
    eventName: string;
    eventId: string;
  };
}
