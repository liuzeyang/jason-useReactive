/// <reference types="react" />
import { ReactiveEffectOptions, ReactiveEffect } from '@vue/reactivity';
export declare const useForceUpdate: () => import("react").DispatchWithoutAction;
export declare type effectionType = {
    effection?: ReactiveEffect;
    changes?: unknown[];
};
export declare function useEffection<T>(fn: () => T, options?: ReactiveEffectOptions, changes?: unknown[]): ReactiveEffect | undefined;
