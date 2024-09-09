import { InjectionToken } from '@angular/core';
import './matomo-configuration';
export declare const MATOMO_TRACKER_SET_FUNCTION: InjectionToken<(command: string, ...args: unknown[]) => void>;
export declare function setFunctionFactory(dummyMode?: boolean, debugTracing?: boolean): (method: string, ...args: unknown[]) => void;
export declare const MATOMO_TRACKER_GET_FUNCTION: InjectionToken<(<T>(func: string, ...args: unknown[]) => Promise<T>)>;
export declare function getFunctionFactory(dummyMode?: boolean, debugTracing?: boolean): <T>(method: string, ...args: unknown[]) => Promise<unknown>;
export declare const MATOMO_TRACKER_INVOKE_FUNCTION: InjectionToken<(command: string, callback: Function) => void>;
export declare function invokeFunctionFactory(dummyMode?: boolean, debugTracing?: boolean): (method: string, callback: Function) => void;
