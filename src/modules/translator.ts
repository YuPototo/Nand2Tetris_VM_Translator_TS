import checkPath, { extractFileBaseName } from './utils/checkPath'
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
        console.log(`args: ${JSON.stringify(this.args)}`)
        const { dirPath, baseName, files } = checkPath(this.path)

        // translate files and write to output file
        const outputLines = []

        for (const file of files) {
            console.log(`Translating ${file} ...`)
            const fileLines = await this.translateFile(file)
            outputLines.push(...fileLines)
        }

        // write to file
        const outputFilePath = `${dirPath}/${baseName}.asm`
        const fileText = outputLines.join('\n') + '\n'
        fs.writeFileSync(outputFilePath, fileText, {
            flag: 'w',
        })
    }

    async translateFile(filePath: string): Promise<string[]> {
        const fileContent = fs.readFileSync(filePath, 'utf-8')

        const parser = new Parser(fileContent)

        const baseName = extractFileBaseName(filePath)
        const codeWriter = new CodeWriter(baseName, this.args.withComment)

        const lines: string[] = []

        if (this.args.withBootstrap) {
            lines.push(...codeWriter.writeInit())
        }

        while (parser.hasMoreLines()) {
            parser.advance()

            if (parser.isWhitespaceOrComment()) {
                continue
            }

            if (this.args.withComment) {
                const lineMark = this.addLineMark(
                    parser.currentLine,
                    parser.currentIndex,
                    baseName,
                )
                lines.push(...lineMark)
            }

            const commandType = parser.commandType()

            switch (commandType) {
                case 'C_PUSH':
                case 'C_POP':
                    const segment = parser.arg1()
                    const index = parser.arg2()
                    lines.push(
                        ...codeWriter.writePushPop(commandType, segment, index),
                    )
                    break

                case 'C_ARITHMETIC': {
                    const operator = parser.arg1()
                    lines.push(...codeWriter.writeArithmetic(operator))
                    break
                }
                case 'C_LABEL': {
                    const label = parser.arg1()
                    lines.push(...codeWriter.writeLabel(label))
                    break
                }
                case 'C_GOTO': {
                    const label = parser.arg1()
                    lines.push(...codeWriter.writeGoto(label))
                    break
                }
                case 'C_IF': {
                    const label = parser.arg1()
                    lines.push(...codeWriter.writeIf(label))
                    break
                }
                case 'C_FUNCTION': {
                    const functionName = parser.arg1()
                    const numLocals = parser.arg2()
                    lines.push(
                        ...codeWriter.writeFunction(functionName, numLocals),
                    )
                    break
                }
                case 'C_RETURN': {
                    lines.push(...codeWriter.writeReturn())
                    break
                }
                case 'C_CALL': {
                    const functionName = parser.arg1()
                    const numArgs = parser.arg2()
                    lines.push(...codeWriter.writeCall(functionName, numArgs))
                    break
                }
                default:
                    throw new Error(`CommandType ${commandType} isn't handled`)
            }
        }

        return lines
    }

    addLineMark(line: string, lineIndex: number, baseName: string): string[] {
        return [
            '',
            '',
            `// --- ${line} ---`,
            `// ${baseName} - line ${lineIndex}`,
        ]
    }
}
