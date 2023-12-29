import checkPath from './utils/checkPath'
import fs from 'fs'
import createEmptyFile from './utils/createEmptyFile'

type Args = {
    withComment: boolean
    withBootstrap: boolean
}

interface TranslatorInterface {
    path: string // path to dir or file
    args: Args
    translate(): void // translate the file or dir
}

export default class Translator implements TranslatorInterface {
    path: string
    args: Args

    constructor(path: string, args: Args) {
        this.path = path
        this.args = args
    }

    async translate() {
        console.log('translate todo....')
        const { isDir, dirPath, baseName, files } = checkPath(this.path)

        // create an empty output file
        createEmptyFile(`${dirPath}/${baseName}.asm`)

        // translate files and write to output file
        for (const file of files) {
            console.log(`Translating ${file} ...`)
            const fileContent = fs.readFileSync(file, 'utf-8')
        }
    }
}
