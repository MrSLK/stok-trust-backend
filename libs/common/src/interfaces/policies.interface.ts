interface IPolicyHandler {
  handle(ability): boolean;
}

type PolicyHandlerCallback = (ability) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
