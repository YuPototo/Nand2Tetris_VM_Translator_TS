import { CommandType } from '../types'

interface IParser {
    lines: string[]
    currentIndex: number
    hasMoreLines(): boolean
    advance(): void
    commandType(): CommandType
    arg1(): string
    arg2(): number
}

export default class Parser implements IParser {
    lines: string[]
    // default -1, so that parser need to advance() to reach the first valid lines
    currentIndex: number = -1

    constructor(fileContent: string) {
        const lines = fileContent.split('\n')

        if (lines.length === 0) {
            throw new Error(`File is empty`)
        }

        this.lines = lines
    }

    hasMoreLines(): boolean {
        return this.currentIndex + 1 < this.lines.length
    }

    advance(): void {
        if (!this.hasMoreLines()) {
            throw new Error('No more lines')
        }

        this.currentIndex++
    }

    isWhitespaceOrComment(): boolean {
        const line = this.lines[this.currentIndex].trim()
        return line === '' || line.startsWith('//')
    }

    commandType(): CommandType {
        const line = this.lines[this.currentIndex].trim()

        const firstWord = line.split(' ')[0]

        switch (firstWord) {
            case 'push':
                return 'C_PUSH'

            case 'pop':
                return 'C_POP'

            case 'add':
            case 'sub':
            case 'neg':
            case 'eq':
            case 'gt':
            case 'lt':
            case 'and':
            case 'or':
            case 'not':
                return 'C_ARITHMETIC'

            case 'label':
                return 'C_LABEL'

            case 'goto':
                return 'C_GOTO'

            case 'if-goto':
                return 'C_IF'

            case 'function':
                return 'C_FUNCTION'

            case 'return':
                return 'C_RETURN'

            case 'call':
                return 'C_CALL'

            default:
                throw new Error(
                    `Parse Line Error: Unknown command type "${firstWord}"`,
                )
        }
    }

    arg1(): string {
        const commandType = this.commandType()

        if (commandType === 'C_RETURN') {
            throw new Error('Parse Line Error: arg1() for C_RETURN')
        }

        // remove comments
        const line = this.lines[this.currentIndex].trim()
        const lineWithoutComments = line.split('//')[0].trim()

        if (
            commandType === 'C_PUSH' ||
            commandType === 'C_POP' ||
            commandType === 'C_FUNCTION' ||
            commandType === 'C_CALL' ||
            commandType === 'C_LABEL' ||
            commandType === 'C_GOTO' ||
            commandType === 'C_IF'
        ) {
            return lineWithoutComments.split(' ')[1].trim()
        } else {
            // C_ARITHMETIC
            return lineWithoutComments.split(' ')[0].trim()
        }
    }

    arg2(): number {
        const commandType = this.commandType()

        // remove comments
        const line = this.lines[this.currentIndex].trim()
        const lineWithoutComments = line.split('//')[0].trim()

        if (
            commandType === 'C_PUSH' ||
            commandType === 'C_POP' ||
            commandType === 'C_FUNCTION' ||
            commandType === 'C_CALL'
        ) {
            return Number(lineWithoutComments.split(' ')[2].trim())
        } else {
            throw new Error(
                `Parse Line Error: arg2() should NOT be called for ${commandType}`,
            )
        }
    }

    get currentLine(): string {
        return this.lines[this.currentIndex].trim()
    }
}
