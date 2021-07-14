import { ReactiveEffect, ReactiveEffectOptions } from '@vue/reactivity'
import nextTick from 'next-tick';
import { useRef } from 'react';
import { useEffection, useForceUpdate } from './effection'

export interface Options extends ReactiveEffectOptions {
  async?: boolean
}
export type useReactiveOptions = Omit<Options, 'lazy'>
export type fnType = <T>() => T

export function useReactive<T>(
  fn: fnType,
  options?: useReactiveOptions,
  changes?: unknown[]
) {

  const forceUpdate = useForceUpdate()
  const jobRef = useRef<fnType | null>(null);
  const shouldRunRef = useRef<boolean>(false);

  const notify = (fn: () => void) => {
    const job = jobRef.current;
    jobRef.current = null;
    if (job !== null) {
      const value = options?.scheduler ? options?.scheduler((job as ReactiveEffect)) : job();
      if (value === undefined) return fn();
      forceUpdate();
    }
    return fn();
  }

  const effection = useEffection(fn, {
    ...options,
    scheduler(effect: ReactiveEffect) {
      if (options?.async) {
        jobRef.current = effect;
        if (!shouldRunRef.current) {
          shouldRunRef.current = true;
          nextTick(() => notify(() => shouldRunRef.current = false));
        }
      } else {
        const value = effect()
        if (value) {
          forceUpdate()
        }
      }
    },
    lazy: true
  }, changes)

  return effection && effection()
}