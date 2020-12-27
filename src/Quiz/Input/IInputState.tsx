export interface IInputState<T> {
  done: boolean;
  result: [number, number];
  value: T;
  onChange(value: T): void;
}
