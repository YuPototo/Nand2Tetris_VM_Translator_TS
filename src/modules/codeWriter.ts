import { CommandType } from '../types'

interface ICodeWriter {
    withComment: boolean
    writeArithmetic(command: string): string[]
    writePushPop(command: CommandType, segment: string, index: number): string[]
}

export default class CodeWriter implements ICodeWriter {
    withComment: boolean = false

    constructor(withComment: boolean) {
        this.withComment = withComment
    }

    writeArithmetic(command: string): string[] {
        return ['C_ARITHMETIC']
    }

    writePushPop(
        command: CommandType,
        segment: string,
        index: number,
    ): string[] {
        return ['C_PUSH', 'C_POP']
    }
}
