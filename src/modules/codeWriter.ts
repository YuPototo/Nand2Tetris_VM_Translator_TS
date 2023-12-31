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
    baseName: string // file name without extension
    withComment: boolean = false
    labelIndex: number = 0

    constructor(baseName: string, withComment: boolean) {
        this.baseName = baseName
        this.withComment = withComment
    }

    writeInit(): string[] {
        return ['@256', 'D=A', '@SP', 'M=D', ...this.writeCall('Sys.init', 0)]
    }

    writeArithmetic(command: string): string[] {
        let lines: string[] = []

        if (command === 'add') {
            lines = this.writeAdd()
        } else if (command === 'sub') {
            lines = this.writeSub()
        } else if (command === 'neg') {
            lines = this.writeNeg()
        } else if (command === 'eq' || command === 'gt' || command === 'lt') {
            lines = this.writeCompare(command)
        } else if (command === 'and') {
            lines = this.writeAnd()
        } else if (command === 'or') {
            lines = this.writeOr()
        } else if (command === 'not') {
            lines = this.writeNot()
        } else {
            throw new Error(`Arithmetic command ${command} isn't handled`)
        }

        return lines
    }

    writePushPop(
        command: CommandType,
        segment: string,
        indexOrValue: number,
    ): string[] {
        let lines: string[] = []

        if (command === 'C_PUSH') {
            if (segment === 'constant') {
                lines = this.pushConstant(indexOrValue)
            } else if (
                segment === 'local' ||
                segment === 'argument' ||
                segment === 'this' ||
                segment === 'that'
            ) {
                lines = this.pushVirtualSegment(segment, indexOrValue)
            } else if (segment === 'pointer') {
                lines = this.pushPointer(indexOrValue)
            } else if (segment === 'temp') {
                lines = this.pushTemp(indexOrValue)
            } else if (segment === 'static') {
                lines = this.pushStatic(indexOrValue)
            } else {
                throw new Error(`Segment ${segment} isn't handled`)
            }
        } else if (command === 'C_POP') {
            if (segment === 'constant') {
                throw new Error('Cannot pop to constant')
            } else if (
                segment === 'local' ||
                segment === 'argument' ||
                segment === 'this' ||
                segment === 'that'
            ) {
                lines = this.popVirtualSegment(segment, indexOrValue)
            } else if (segment === 'pointer') {
                lines = this.popPointer(indexOrValue)
            } else if (segment === 'temp') {
                lines = this.popTemp(indexOrValue)
            } else if (segment === 'static') {
                lines = this.popStatic(indexOrValue)
            } else {
                throw new Error(`Segment ${segment} isn't handled`)
            }
        } else {
            throw new Error(`CommandType ${command} isn't handled`)
        }

        return lines
    }

    writeLabel(label: string): string[] {
        return [`(${label})`]
    }

    writeGoto(label: string): string[] {
        return [`@${label}`, '0;JMP']
    }

    writeIf(label: string): string[] {
        return [...this.spMinus(), 'D=M', `@${label}`, 'D;JNE']
    }

    writeFunction(functionName: string, numLocals: number): string[] {
        let lines: string[] = []

        lines.push(`(${functionName})`)

        for (let i = 0; i < numLocals; i++) {
            lines.push(...this.pushConstant(0))
        }

        return lines
    }

    writeReturn(): string[] {
        let lines = []

        // frame (R13) = LCL
        lines.push('@LCL', 'D=M', '@R13', 'M=D')

        // retAddr (R14) = *(frame - 5)
        lines.push('@R13', 'D=M', '@5', 'A=D-A', 'D=M', '@R14', 'M=D')

        // *ARG = pop()
        lines.push(
            '@ARG',
            'D=M',
            '@R15',
            'M=D',
            '@SP',
            'AM=M-1',
            'D=M',
            '@R15',
            'A=M',
            'M=D',
        )

        // SP = ARG + 1
        lines.push('@ARG', 'D=M+1', '@SP', 'M=D')

        // THAT = *(frame - 1)
        lines.push('@R13', 'D=M', '@1', 'A=D-A', 'D=M', '@THAT', 'M=D')

        // THIS = *(frame - 2)
        lines.push('@R13', 'D=M', '@2', 'A=D-A', 'D=M', '@THIS', 'M=D')

        // ARG = *(frame - 3)
        lines.push('@R13', 'D=M', '@3', 'A=D-A', 'D=M', '@ARG', 'M=D')

        // LCL = *(frame - 4)
        lines.push('@R13', 'D=M', '@4', 'A=D-A', 'D=M', '@LCL', 'M=D')

        // goto retAddr
        lines.push('@R14', 'A=M', '0;JMP')

        return lines
    }

    writeCall(functionName: string, numArgs: number): string[] {
        let lines: string[] = []

        this.labelIndex += 1

        // push return address
        const returnAddressLabel = `${functionName}$ret.${this.labelIndex}`

        lines.push(...this.pushReturnAddressToFrame(returnAddressLabel))

        // push LCL, ARG, THIS, THAT
        lines.push(...this.pushSegmentToFrame('LCL'))
        lines.push(...this.pushSegmentToFrame('ARG'))
        lines.push(...this.pushSegmentToFrame('THIS'))
        lines.push(...this.pushSegmentToFrame('THAT'))

        // reposition ARG
        lines.push(...this.repositionArg(numArgs))

        // reposition LCL
        lines.push(...this.repositionLCL())

        // go to function
        lines.push(...[`@${functionName}`, '0;JMP'])

        // return address label
        lines.push(`(${returnAddressLabel})`)

        return lines
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

    private writeAdd(): string[] {
        return [...this.popFirstTwoValues(), 'M=D+M', ...this.spPlus()]
    }

    private writeSub(): string[] {
        return [...this.popFirstTwoValues(), 'M=M-D', ...this.spPlus()]
    }

    private writeNeg(): string[] {
        return [...this.spMinus(), 'M=-M', ...this.spPlus()]
    }

    private writeCompare(operator: string): string[] {
        this.labelIndex += 1

        const isTrueLabel = `${this.baseName}_${operator}_TRUE_${this.labelIndex}`
        const notTrueLabel = `${this.baseName}_${operator}_NOT_TRUE_${this.labelIndex}`

        return [
            ...this.popFirstTwoValues(),
            'D=M-D',
            `@${isTrueLabel}`,
            `D;J${operator.toUpperCase()}`,
            '@SP',
            'A=M',
            'M=0',
            `@${notTrueLabel}`,
            '0;JMP',
            `(${isTrueLabel})`,
            '@SP',
            'A=M',
            'M=-1',
            `(${notTrueLabel})`,
            '@SP',
            'M=M+1',
        ]
    }

    private writeAnd(): string[] {
        return [...this.popFirstTwoValues(), 'M=D&M', ...this.spPlus()]
    }

    private writeOr(): string[] {
        return [...this.popFirstTwoValues(), 'M=D|M', ...this.spPlus()]
    }

    private writeNot(): string[] {
        return [...this.spMinus(), 'M=!M', ...this.spPlus()]
    }

    private popFirstTwoValues(): string[] {
        return [...this.spMinus(), 'D=M', ...this.spMinus()]
    }

    private spMinus(): string[] {
        return ['@SP', 'AM=M-1']
    }

    private spPlus(): string[] {
        return ['@SP', 'M=M+1']
    }

    private pushReturnAddressToFrame(returnAddressLabel: string): string[] {
        return [
            `@${returnAddressLabel}`,
            'D=A',
            '@SP',
            'A=M',
            'M=D',
            ...this.spPlus(),
        ]
    }

    private pushSegmentToFrame(
        segment: 'LCL' | 'THIS' | 'THAT' | 'ARG',
    ): string[] {
        return [`@${segment}`, 'D=M', '@SP', 'A=M', 'M=D', ...this.spPlus()]
    }

    private repositionArg(numArgs: number): string[] {
        return [
            '@SP',
            'D=M',
            `@${numArgs}`,
            'D=D-A',
            '@5',
            'D=D-A',
            '@ARG',
            'M=D',
        ]
    }

    private repositionLCL(): string[] {
        return ['@SP', 'D=M', '@LCL', 'M=D']
    }
}
