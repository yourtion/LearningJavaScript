/**
 * 43 - Exclude
 * 
 * 实现内置的Exclude <T，U>
 * > 从T中排除可分配给U的那些类型
*/
type MyExclude<T, U> = T extends U ? never : T;

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyExclude<"a" | "b" | "c", "a">, Exclude<"a" | "b" | "c", "a">>>,
  Expect<Equal<MyExclude<"a" | "b" | "c", "a" | "b">, Exclude<"a" | "b" | "c", "a" | "b">>>,
  Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>,
]
