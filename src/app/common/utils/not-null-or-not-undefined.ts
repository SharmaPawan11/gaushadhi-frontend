/**
 * Predicate with type guard, used to filter out null or undefined values
 * in a filter operation.
 */
import {Observable} from "rxjs";

export function notNullOrNotUndefined<T>(val: T | undefined | null ): val is T {
  return val !== undefined && val !== null ;
}
