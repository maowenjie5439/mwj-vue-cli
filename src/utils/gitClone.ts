import { simpleGit, SimpleGitOptions } from "simple-git"
import createLogger from "progress-estimator"
import chalk from "chalk"
import log from "./log"

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 当前工作目录
  binary: "git", // 指定 git 二进制文件路径
  maxConcurrentProcesses: 6, // 最大并发进程数
}

// 初始化进度条
const logger = createLogger({
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
            // console.info(item)
            chalk.green(item)
        ),
    },
});
export const gitClone = async (downloadUrl: string, projectName: string, options: Record<string, any>={}) => {
  const git = simpleGit(options)
  try {
    // 开始下载代码并展示预估时间进度条
    await logger(git.clone(downloadUrl, projectName, options), '代码下载中: ', {
      estimate: 8000 // 展示预估时间
    })

    // 下面就是一些相关的提示
    console.log()
    console.log(chalk.blueBright(`==================================`))
    console.log(chalk.blueBright(`=== 欢迎使用 mwj-vue-cli 脚手架 ===`))
    console.log(chalk.blueBright(`==================================`))
    console.log()

    log.success(`项目创建成功 ${chalk.blueBright(projectName)}`)
    log.success(`执行以下命令启动项目：`)
    log.info(`cd ${chalk.blueBright(projectName)}`)
    log.info(`${chalk.yellow('pnpm')} install`)
    log.info(`${chalk.yellow('pnpm')} run dev`)
  } catch (err: any) {
    log.error("下载失败")
    log.error(String(err))
    // console.log('下载失败, err:', err)
  }
}
