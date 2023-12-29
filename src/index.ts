import Translator from './modules/translator'

main()

async function main() {
    const args = process.argv

    const [, , ...rest] = args
    const [filePath, comment] = rest

    const withComment = comment === '--comment'

    const translator = new Translator(filePath, withComment)

    await translator.translate()
}
