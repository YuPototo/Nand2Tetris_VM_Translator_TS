import Translator from './modules/translator'
import checkPath from './modules/utils/checkPath'

main()

async function main() {
    const args = process.argv

    const [, , ...rest] = args
    const [filePath, comment] = rest

    const translator = new Translator(filePath)

    await translator.translate()
}
