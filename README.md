# React 基础

## React 重新获取数据

> 把 search 功能放在服务器进行，取消前端的硬编码搜索。

## 使用 React 进行显式数据获取

> 避免频繁请求 API 造成 API 压力和无法请求的问题。

## React 中的第三方库

> 使用 axios 替换 浏览器的 fetch

## React 中的 Async / Await （高阶）

> 使用 async/await + try catch 代替 promise + catch，代码看起来跟同步编程类似。

## React 表单

> 使用 React 的 form

# React 中的样式

## React 中的 CSS 模块化

> [引入 Create React App 中 CSS 的模块化支持](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

## React 中的样式组件

> CSS-in-JS 和 CSS-in-CSS 这两种策略及其 方法（如： [Styled Components](https://styled-components.com/) 和 CSS Modules）在 React 开发人员中很受欢迎。选择使用最适合你和你的团队的方法。

## React 中的 SVG

# React 维护

## React 性能（高级）

> 使用 memo useMemo useCallback，优化重复渲染和重复复杂计算。（避免过早优化，只有性能瓶颈才进行适当优化）

## 在 React 中使用 TypeScript

> 强类型编程语言 TypeScript，每次使用新类型之前需要提前定义类型。

## 从单元测试到集成测试

> jest 单元测试工具
> 每一个文件的测试文件定义为 filename.test.js。
> 使用 npm run test 执行单元测试

## React 项目结构

> 项目结构不是一成不变的，也没有最好的结构。根据项目实际状况，选择一个尽量简单的结构可能更有效率。
> 可选的结构：每个组件一个文件夹，包含组件、css、test、resource……；面向领域文件夹结构……

# 真实 React 世界（高级）

## 排序

> 使用 Lodash 库排序

## 逆序排序

> 使用对象 useState
