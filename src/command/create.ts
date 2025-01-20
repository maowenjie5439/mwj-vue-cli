import { select } from "@inquirer/prompts";
import { gitClone } from "../utils/gitClone";
import path from "path";
import fs from "fs";
import log from "../utils/log";

export type Template = {
    name: string; // 模板名称
    downloadUrl: string; // 下载地址
    desc: string; // 描述
    branch: string; // 分支
};

const templateMap: Record<string, Template> = {
    "vite-vue3-typescript-element-plus": {
        name: "vite-vue3-typescript-element-plus",
        downloadUrl: "https://github.com/maowenjie5439/vite-vue-ts-project.git",
        desc: "vue3后台管理系统模板",
        branch: "main",
    },
    test: {
        name: "test",
        downloadUrl: "https://github.com/maowenjie5439/vite-vue-ts-project.git",
        desc: "test",
        branch: "main",
    },
};

export async function create(projectName: string) {
    console.log("projectName:", projectName);
    const template = await select({
        message: "请选择模板",
        choices: Object.keys(templateMap).map((key) => ({
            name: templateMap[key].name,
            value: templateMap[key],
        })),
    });

    // 检查项目是否已存在
    // 1. 获取项目路径
    const projectPath = path.resolve(process.cwd(), projectName);
    // 2. 检查项目是否已存在
    if (fs.existsSync(projectPath)) {
        const isCover = await select({
            message: `项目已存在，是否覆盖？`,
            choices: [
                { name: "是", value: true },
                { name: "否", value: false },
            ],
        });
        if (isCover) {
            fs.rmSync(projectPath, { recursive: true, force: true });
        }else{
            log.info(`已取消创建`)
            return;
        }
    }
    // 克隆项目
    if (template) {
        gitClone(template.downloadUrl, projectName);
    }
}
