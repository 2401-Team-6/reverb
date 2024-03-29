import functions from "../services/fn";

export class Step {
  #cache: { [key: string]: any };
  #previousSteps: { [key: string]: boolean };
  #funcName: string;

  constructor(cache: { [key: string]: any }, funcName: string) {
    this.#cache = cache;
    this.#previousSteps = {};
    this.#funcName = funcName;
  }

  async run(id: string, callback: () => Promise<any>) {
    if (this.#previousSteps[id]) {
      throw new Error(
        `${this.#funcName}: Step Ids must be unique. ${id} already exists.`
      );
    }

    this.#previousSteps[id] = true;

    if (id in this.#cache) {
      return this.#cache[id];
    }
    const result = await callback();
    throw new StepComplete(id, result);
  }

  async delay(id: string, timePeriod: string) {
    if (this.#previousSteps[id]) {
      throw new Error(
        `${this.#funcName}: Step Ids must be unique. ${id} already exists.`
      );
    }

    this.#previousSteps[id] = true;

    if (id in this.#cache) {
      return this.#cache[id];
    }
    timePeriod = timePeriod.toLowerCase();

    const regex = /(?<quantity>\d+)(?<unit>s|m|h|d|w)/g;
    let match = regex.exec(timePeriod);

    if (!match) {
      throw new Error(
        `${
          this.#funcName
        }: ${timePeriod} not correctly formatted time period string.`
      );
    }

    let totalMs = 0;
    while (match) {
      const time = match.groups as {
        quantity: string;
        unit: "s" | "m" | "h" | "d" | "w";
      };

      let ms = Number(time.quantity);

      switch (time.unit) {
        case "w":
          ms *= 7;
        case "d":
          ms *= 24;
        case "h":
          ms *= 60;
        case "m":
          ms *= 60;
        case "s":
          ms *= 1000;
          break;
        default:
          const _unknown: never = time.unit;
          return _unknown;
      }

      totalMs += ms;
      match = regex.exec(timePeriod);
    }

    throw new DelayInitiated(id, totalMs);
  }

  async invoke(id: string, invokedFnName: string, payload?: object) {
    if (this.#previousSteps[id]) {
      throw new Error(
        `${this.#funcName}: Step Ids must be unique. ${id} already exists.`
      );
    }

    this.#previousSteps[id] = true;

    if (id in this.#cache) {
      return this.#cache[id];
    }

    const fn = functions.getFunction(invokedFnName);

    if (!fn) {
      throw new Error(
        `${this.#funcName}: Invoked function ${invokedFnName} does not exist`
      );
    }

    throw new InvokeInitiated(id, invokedFnName, payload);
  }

  async emitEvent(id: string, eventId: string, payload?: object) {
    if (this.#previousSteps[id]) {
      throw new Error(
        `${this.#funcName}: Step Ids must be unique. ${id} already exists.`
      );
    }

    this.#previousSteps[id] = true;

    if (id in this.#cache) {
      return this.#cache[id];
    }

    if (!Object.keys(functions.getAllFunctions().events).includes(eventId)) {
      throw new Error(`${this.#funcName}: Event ${eventId} does not exist`);
    }

    throw new EventEmitted(id, eventId, payload);
  }
}

export class StepComplete extends Error {
  stepId: string;
  stepValue: any;

  constructor(stepId: string, stepValue: any) {
    super(
      `StepComplete ${stepId}: Do not catch errors from step.run inside a created function. And be sure to await each step.`
    );
    this.stepId = stepId;
    this.stepValue = stepValue;
  }
}

export class DelayInitiated extends Error {
  stepId: string;
  delayInMs: number;

  constructor(stepId: string, delayInMs: number) {
    super(
      `DelayIntiated ${stepId}: Do not catch errors from step.delay inside a created function. And be sure to await each step.`
    );
    this.stepId = stepId;
    this.delayInMs = delayInMs;
  }
}

export class InvokeInitiated extends Error {
  stepId: string;
  invokedFnName: string;
  payload?: object;

  constructor(stepId: string, invokedFnName: string, payload?: object) {
    super(
      `InvokeInitiated ${stepId}: Do not catch errors from step.invoke inside a created function. And be sure to await each step.`
    );

    this.stepId = stepId;
    this.invokedFnName = invokedFnName;
    this.payload = payload;
  }
}

export class EventEmitted extends Error {
  stepId: string;
  eventId: string;
  payload?: object;

  constructor(stepId: string, eventId: string, payload?: object) {
    super(
      `EventEmitted ${stepId}: Do not catch errors from step.emitEvent inside a created function. And be sure to await each step.`
    );

    this.stepId = stepId;
    this.eventId = eventId;
    this.payload = payload;
  }
}
