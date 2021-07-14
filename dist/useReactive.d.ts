import { ReactiveEffectOptions } from '@vue/reactivity';
export interface Options extends ReactiveEffectOptions {
    async?: boolean;
}
export declare type useReactiveOptions = Omit<Options, 'lazy'>;
export declare type fnType = <T>() => T;
export declare function useReactive<T>(fn: fnType, options?: useReactiveOptions, changes?: unknown[]): any;
