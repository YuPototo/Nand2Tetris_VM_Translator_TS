import Translator from './modules/translator'

main()

async function main() {
    const args = process.argv

    const [, , ...rest] = args
    const [filePath, comment, bootstrap] = rest

    const withComment = comment === '--comment==true'
    const withBootstrap = bootstrap !== '--bootstrap==false'

    const translator = new Translator(filePath, { withComment, withBootstrap })

    await translator.translate()
}
