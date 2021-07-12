/**
 * 4 - 实现 Pick
 * 
 * 无需使用内置的`Pick<T, K>`泛型：
 * 通过从`K`中选择属性`T`来构造类型
*/
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  // @ts-expect-error
  MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}
