import checkPath from './utils/checkPath'
import fs from 'fs'
import Parser from './parser'
import CodeWriter from './codeWriter'

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
        const { isDir, dirPath, baseName, files } = checkPath(this.path)

        // translate files and write to output file
        const outputLines = ['asd', 'asd']
        for (const file of files) {
            console.log(`Translating ${file} ...`)
            const fileLines = await this.translateFile(file)
            outputLines.push(...fileLines)
        }

        // create an empty output file
        fs.writeFileSync(`${dirPath}/${baseName}.asm`, outputLines.join('\n'), {
            flag: 'w',
        })
    }

    async translateFile(filePath: string): Promise<string[]> {
        const fileContent = fs.readFileSync(filePath, 'utf-8')

        const parser = new Parser(fileContent)

        const codeWriter = new CodeWriter(this.args.withComment)

        const lines: string[] = []

        while (parser.hasMoreLines()) {
            parser.advance()

            if (parser.isWhitespaceOrComment()) {
                continue
            }

            const commandType = parser.commandType()

            // switch (commandType) {
            //     case 'C_PUSH':
            //     case 'C_POP':
            //         const segment = parser.arg1()
            //         const index = parser.arg2()
            //         lines = codeWriter.writePushPop(commandType, segment, index)
            //         break
            //     case 'C_ARITHMETIC':
            //         const operator = parser.arg1()
            //         lines = codeWriter.writeArithmetic(operator)
            //         break
            //     case 'C_LABEL':
            //     case 'C_GOTO':
            //     case 'C_IF':
            //     case 'C_FUNCTION':
            //     case 'C_RETURN':
            //     case 'C_CALL':
            //         throw new Error('Not implemented')
            //     default:
            //         throw new Error(`CommandType ${commandType} isn't handled`)
            // }
        }

        return lines
    }
}
