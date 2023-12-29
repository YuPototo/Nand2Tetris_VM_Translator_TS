import { CommandType } from '../types'

interface ICodeWriter {
    withComment: boolean
    writeArithmetic(command: string): string[]
    writePushPop(command: CommandType, segment: string, index: number): string[]
}

const SEGMENT_MAP = {
    local: 'LCL',
    argument: 'ARG',
    this: 'THIS',
    that: 'THAT',
}

export default class CodeWriter implements ICodeWriter {
    baseName: string
    withComment: boolean = false

    constructor(baseName: string, withComment: boolean) {
        this.baseName = baseName
        this.withComment = withComment
    }

    writeArithmetic(command: string): string[] {
        return ['C_ARITHMETIC']
    }

    writePushPop(
        command: CommandType,
        segment: string,
        indexOrValue: number,
    ): string[] {
        let res: string[] = []
        if (command === 'C_PUSH') {
            if (segment === 'constant') {
                res = this.pushConstant(indexOrValue)
            } else if (
                segment === 'local' ||
                segment === 'argument' ||
                segment === 'this' ||
                segment === 'that'
            ) {
                res = this.pushVirtualSegment(segment, indexOrValue)
            } else if (segment === 'pointer') {
                res = this.pushPointer(indexOrValue)
            } else if (segment === 'temp') {
                res = this.pushTemp(indexOrValue)
            } else if (segment === 'static') {
                res = this.pushStatic(indexOrValue)
            }
        }

        if (command === 'C_POP') {
            if (segment === 'constant') {
                throw new Error('Cannot pop to constant')
            } else if (
                segment === 'local' ||
                segment === 'argument' ||
                segment === 'this' ||
                segment === 'that'
            ) {
                res = this.popVirtualSegment(segment, indexOrValue)
            } else if (segment === 'pointer') {
                res = this.popPointer(indexOrValue)
            } else if (segment === 'temp') {
                res = this.popTemp(indexOrValue)
            } else if (segment === 'static') {
                res = this.popStatic(indexOrValue)
            }
        }

        return res
    }

    private pushVirtualSegment(
        segment: 'local' | 'argument' | 'this' | 'that',
        index: number,
    ): string[] {
        return [
            `@${SEGMENT_MAP[segment]}`,
            'D=M',
            `@${index}`,
            'A=A+D',
            'D=M',
            '@SP',
            'A=M',
            'M=D',
            ...this.spPlus(),
        ]
    }

    private popVirtualSegment(
        segment: 'local' | 'argument' | 'this' | 'that',
        index: number,
    ) {
        return [
            `@${SEGMENT_MAP[segment]}`,
            'D=M',
            `@${index}`,
            'D=A+D',
            '@R13',
            'M=D',
            '@SP',
            'AM=M-1',
            'D=M',
            '@R13',
            'A=M',
            'M=D',
        ]
    }

    private pushConstant(constant: number): string[] {
        return [`@${constant}`, 'D=A', '@SP', 'A=M', 'M=D', ...this.spPlus()]
    }

    private pushPointer(index: number): string[] {
        if (index !== 0 && index !== 1) {
            throw new Error('Invalid pointer index')
        }

        // 0 -> THIS --> RAM[3]
        // 1 -> THAT --> RAM[4]
        const ramIndex = index === 0 ? 3 : 4

        return [`@${ramIndex}`, 'D=M', '@SP', 'A=M', 'M=D', ...this.spPlus()]
    }

    private popPointer(index: number): string[] {
        if (index !== 0 && index !== 1) {
            throw new Error('Invalid pointer index')
        }

        // 0 -> THIS --> RAM[3]
        // 1 -> THAT --> RAM[4]
        const ramIndex = index === 0 ? 3 : 4

        return [...this.spMinus(), 'D=M', `@${ramIndex}`, 'M=D']
    }

    private pushTemp(index: number): string[] {
        if (index < 0 || index > 7) {
            throw new Error('Invalid temp index')
        }

        return [`@${5 + index}`, 'D=M', '@SP', 'A=M', 'M=D', ...this.spPlus()]
    }

    private popTemp(index: number): string[] {
        if (index < 0 || index > 7) {
            throw new Error('Invalid temp index')
        }

        return [...this.spMinus(), 'D=M', `@${5 + index}`, 'M=D']
    }

    private pushStatic(index: number): string[] {
        return [
            `@${this.baseName}.${index}`,
            'D=M',
            '@SP',
            'A=M',
            'M=D',
            ...this.spPlus(),
        ]
    }

    private popStatic(index: number): string[] {
        return [...this.spMinus(), 'D=M', `@${this.baseName}.${index}`, 'M=D']
    }

    private spMinus(): string[] {
        return ['@SP', 'AM=M-1']
    }

    private spPlus(): string[] {
        return ['@SP', 'M=M+1']
    }
}
