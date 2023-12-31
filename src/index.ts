import checkArg from './modules/checkArg'
import Translator from './modules/translator'

main()

async function main() {
    const [, , filePath, ...restArgs] = process.argv

    const translatorArgs = checkArg(restArgs)

    const translator = new Translator(filePath, translatorArgs)

    await translator.translate()
}
