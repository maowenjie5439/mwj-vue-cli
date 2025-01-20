import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default defineConfig([
    {
        input: {
            index: "src/index.ts", // 打包入口文件
        },
        output: [
            {
                dir: "dist", // 输出目标文件夹
                format: "esm", // 输出 esm 文件
            },
        ],
        // 这些依赖的作用上文提到过
        plugins: [
            nodeResolve(), // 用于帮助 Rollup 解析和处理 Node.js 模块（Node.js 的 CommonJS 模块规范）
            externals({
                devDeps: false, // 可以识别我们 package.json 中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
            }),
            typescript(), // 支持rollup打包ts文件
            json(), // 支持rollup打包json文件
            commonjs(), // 支持rollup打包commonjs文件
            terser(), // Rollup 构建过程中对生成的 JavaScript 代码进行压缩和混淆，以减小最终输出文件的体积。
        ],
    },
]);
