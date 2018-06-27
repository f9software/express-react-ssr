import * as redux from 'redux';

export const promises: Promise<any>[] = [];

function isPromise(data: any | undefined): boolean {
    return data && typeof data.then === 'function';
}

export function reset() {
    promises.length = 0;
}

export default function ssr() {
    return (api: redux.MiddlewareAPI) => (next: redux.Dispatch<redux.AnyAction>) => (action: redux.AnyAction) => {
        let promise: Promise<any> | undefined;

        if (isPromise(action.payload)) {
            promise = action.payload;
        }
        else if (isPromise(action.payload.promise)) {
            promise = action.payload.promise;
        }
        else if (isPromise(action.promise)) {
            promise = action.promise;
        }

        if (promise) {
            promises.push(promise);
        }

        // let next middlewares handle the action
        next(action);
    }
}
