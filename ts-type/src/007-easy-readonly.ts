/*
  7 - 实现 Readonly
  -------
  by Anthony Fu (@antfu) #简单 #built-in #readonly #object-keys
  
  ### 题目
    
  无需使用内置的`Readonly<T>`泛型即可。
  
  构造一个类型，并将T的所有属性设置为只读，这意味着无法重新分配所构造类型的属性。

*/

/* _____________ 你的代码 _____________ */

type MyReadonly<T> = { readonly [P in keyof T]: T[P] }

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyReadonly<Todo1>, Readonly<Todo1>>>,
]

interface Todo1 {
  title: string
  description: string
  completed: boolean
}
