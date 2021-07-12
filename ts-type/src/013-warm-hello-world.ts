/*
  13 - Hello World
  -------
  by Anthony Fu (@antfu) #热身 
  
  ### 题目
  
  Hello, World!
  
  这个简单的提问希望让你可以快速上手 Type Challenges。在这里，我们使用了一些神奇的技巧让 TypeScript 通过自身的类型系统来实现自动判题。 
  
  在这个挑战中，你需要修改下方的代码使得测试通过（使其没有类型错误）。
*/

/* _____________ 你的代码 _____________ */

type HelloWorld = string // expected to be a string


/* _____________ 测试用例 _____________ */
import { Equal, Expect, NotAny } from '@type-challenges/utils'

type cases = [
  Expect<NotAny<HelloWorld>>,
  Expect<Equal<HelloWorld, string>>
]
