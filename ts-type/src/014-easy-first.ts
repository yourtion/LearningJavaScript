/**
 * 14 - 第一个元素
 * 
 * 实现一个通用`First<T>`，它接受一个数组`T`并返回它的第一个元素的类型。
 */
type First<T extends any[]> = T extends [] ? never : T[0]


/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>
]
