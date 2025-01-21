import { select } from "@inquirer/prompts";
import { gitClone } from "../utils/gitClone";
import path from "path";
import fs from "fs";
import log from "../utils/log";
import axios, { AxiosResponse } from "axios";
import { name, version } from "../../package.json";
import { gt } from "lodash";
import chalk from "chalk";
import { printBanner } from "../utils/banner";

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
        } else {
            log.info(`已取消创建`);
            return;
        }
    }

    await checkVersion();
    // 克隆项目
    if (template) {
        try {
            await gitClone(template.downloadUrl, projectName);
        } catch (error) {
            log.error("下载失败");
            log.error(String(error));
        }
    }
}

const checkVersion = async () => {
    const path = `https://registry.npmjs.org/${name}`;
    const res = (await axios.get(path)) as AxiosResponse;
    const latestVersion = res.data["dist-tags"].latest;
    if (gt(latestVersion, version)) {
        console.warn(
            `检查到mwj-vue-cli最新版本： ${chalk.blueBright(
                latestVersion
            )}，当前版本是：${chalk.blackBright(version)}`
        );
        console.log(
            `可使用： ${chalk.yellow(
                "npm install mwj-vue-cli@latest"
            )}，或者使用：${chalk.yellow("mwj-vue-cli update")}更新`
        );
    }
};
