import {
  Event,
  FunctionPayload,
  CronPayload,
  UpdateCronPayload,
  RpcResponse,
  CompleteResult,
  StepResult,
  DelayResult,
  InvokeResult,
  EmitEventResult,
} from "../types/types";

export const isValidEvent = (event: unknown): event is Event => {
  return (
    !!event &&
    typeof event === "object" &&
    "name" in event &&
    typeof event.name === "string"
  );
};

export const isValidFunctionPayload = (
  payload: unknown
): payload is FunctionPayload => {
  return (
    !!payload &&
    typeof payload === "object" &&
    "name" in payload &&
    typeof payload.name === "string" &&
    "event" in payload &&
    isValidEvent(payload.event) &&
    "cache" in payload &&
    typeof payload.cache === "object" &&
    !!payload.cache
  );
};

export const isValidRpcResponse = (body: unknown): body is RpcResponse => {
  return (
    !!body &&
    typeof body === "object" &&
    "id" in body &&
    (typeof body.id === "number" || typeof body.id === "string") &&
    (!("result" in body) ||
      (!!body.result &&
        (isValidCompleteResult(body.result) ||
          isValidStepResult(body.result) ||
          isValidDelayResult(body.result) ||
          isValidInvokedResult(body.result) ||
          isValidEmitEventResult(body.result)))) &&
    (!("error" in body) || typeof body.error === "string")
  );
};

const isValidCompleteResult = (result: unknown): result is CompleteResult => {
  return (
    !!result &&
    typeof result === "object" &&
    "type" in result &&
    result.type === "complete"
  );
};

const isValidStepResult = (result: unknown): result is StepResult => {
  return (
    !!result &&
    typeof result === "object" &&
    "type" in result &&
    result.type === "step" &&
    "stepId" in result &&
    typeof result.stepId === "string" /*&&
    'stepValue' in result/*/
  );
};

const isValidDelayResult = (result: unknown): result is DelayResult => {
  return (
    !!result &&
    typeof result === "object" &&
    "type" in result &&
    result.type === "delay" &&
    "stepId" in result &&
    typeof result.stepId === "string" &&
    "delayInMs" in result &&
    typeof result.delayInMs === "number"
  );
};

const isValidInvokedResult = (result: unknown): result is InvokeResult => {
  return (
    !!result &&
    typeof result === "object" &&
    "type" in result &&
    result.type === "invoke" &&
    "stepId" in result &&
    typeof result.stepId === "string" &&
    "invokedFnName" in result &&
    typeof result.invokedFnName === "string"
  );
};

const isValidEmitEventResult = (result: unknown): result is EmitEventResult => {
  return (
    !!result &&
    typeof result === "object" &&
    "type" in result &&
    result.type === "emitEvent" &&
    "stepId" in result &&
    typeof result.stepId === "string" &&
    "eventId" in result &&
    typeof result.eventId === "string"
  );
};

export const isValidCronPayload = (
  payload: unknown
): payload is CronPayload => {
  return (
    !!payload &&
    typeof payload === "object" &&
    "funcName" in payload &&
    typeof payload.funcName === "string"
  );
};

export const isValidUpdateCronPayload = (
  payload: unknown
): payload is UpdateCronPayload => {
  return (
    !!payload &&
    typeof payload === "object" &&
    "hash" in payload &&
    typeof payload.hash === "string"
  );
};
