/** 
 * 11 - 元组转换为对象
 * 
 * 给定数组，转换为对象类型，键/值必须在给定数组中。
*/
type TupleToObject<T extends readonly any[]> = { [P in T[number]]: P }

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type cases = [
  Expect<Equal<TupleToObject<typeof tuple>, { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y' }>>,
]

type error = TupleToObject<[[1, 2], {}]>
