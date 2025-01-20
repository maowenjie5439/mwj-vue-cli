import {Command} from "commander"
import { version } from "../package.json"
const program = new Command('mwj-vue-cli')
import {create} from "./command/create"
import {input, select} from "@inquirer/prompts"

program.version(version, "-v, --version").description("My Vue CLI Version")
program
  .command("create")
  .description("create a new project")
  .argument("[project-name]", "project name")
  .action(async (projectName) => {
    while (!projectName) {
      // console.log(`create ${projectName} project`)
      projectName = await input({message: "请输入项目名称: "})
    }
    create(projectName)
  })

program.parse(process.argv)
