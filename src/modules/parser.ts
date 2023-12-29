import { CommandType } from '../types'

interface IParser {
    lines: string[]
    currentLine: number
    hasMoreLines(): boolean
    advance(): void
    commandType(): CommandType
    arg1(): string
    arg2(): number
}

export default class Parser implements IParser {
    lines: string[]
    // default -1, so that parser need to advance() to reach the first valid lines
    currentLine: number = -1

    constructor(fileContent: string) {
        const lines = fileContent.split('\n')

        if (lines.length === 0) {
            throw new Error(`File is empty`)
        }

        this.lines = lines
    }

    hasMoreLines(): boolean {
        return this.currentLine < this.lines.length
    }

    // advance to next line that is not empty or comment
    advance(): void {
        this.currentLine++

        while (this.hasMoreLines()) {
            const line = this.lines[this.currentLine]

            if (line.trim() === '' || line.trim().startsWith('//')) {
                this.currentLine++
            } else {
                break
            }
        }

        if (!this.hasMoreLines()) {
            throw new Error('No more lines')
        }
    }

    commandType(): CommandType {
        const line = this.lines[this.currentLine].trim()

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

        if (
            commandType === 'C_PUSH' ||
            commandType === 'C_POP' ||
            commandType === 'C_FUNCTION' ||
            commandType === 'C_CALL' ||
            commandType === 'C_LABEL' ||
            commandType === 'C_GOTO' ||
            commandType === 'C_IF'
        ) {
            return this.lines[this.currentLine].split(' ')[1]
        } else {
            // C_ARITHMETIC
            return this.lines[this.currentLine].split(' ')[0]
        }
    }

    arg2(): number {
        const commandType = this.commandType()

        if (
            commandType === 'C_PUSH' ||
            commandType === 'C_POP' ||
            commandType === 'C_FUNCTION' ||
            commandType === 'C_CALL'
        ) {
            return Number(this.lines[this.currentLine].split(' ')[2])
        } else {
            throw new Error(
                `Parse Line Error: arg2() should NOT be called for ${commandType}`,
            )
        }
    }
}