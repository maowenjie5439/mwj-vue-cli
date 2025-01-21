import chalk from "chalk";
import figlet from "figlet";

export const printBanner = async () => {
    const data = await figlet("mwj-vue-cli");
    // console.log('data', data)
    console.log(chalk.rgb(40, 156, 193).visible(data));
};

