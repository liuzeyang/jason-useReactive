import { useReducer, useEffect, useRef } from 'react'
import { effect, ReactiveEffectOptions, ReactiveEffect, stop } from '@vue/reactivity'
import { shouldUpdate } from './utils';

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((s: number) => s + 1, 0);
  return forceUpdate;
};

export type effectionType = {
  effection?: ReactiveEffect,
  changes?: unknown[],
}

export function useEffection<T>(
  fn: () => T,
  options?: ReactiveEffectOptions,
  changes?: unknown[]
): ReactiveEffect | undefined {
  const effectionRef = useRef<effectionType>({})

  if (!effectionRef.current.effection) {
    effectionRef.current = {
      effection: effect(fn, options),
      changes: changes ?? []
    }
  } else if (changes && changes.length && shouldUpdate(changes, effectionRef.current.changes ?? [])) {
    stop(effectionRef.current.effection)
    effectionRef.current = {
      effection: effect(fn, options),
      changes: changes ?? []
    }
  }

  const stopEffect = () => stop(effectionRef.current.effection!);
  useEffect(() => stopEffect, []);

  return effectionRef.current.effection;
}