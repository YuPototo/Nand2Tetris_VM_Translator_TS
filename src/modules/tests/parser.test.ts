import Parser from '../parser'

import { expect, test, describe } from 'vitest'

test('init parser', () => {
    const parser = new Parser([
        'push constant 7',
        'push constant 7',
        'push constant 7',
    ])

    expect(parser.currentLine).toBe(-1)
    expect(parser.lines.length).toBe(3)
})

describe('advance()', () => {
    test('simple advance', () => {
        const parser = new Parser([
            'push constant 7',
            'push constant 7',
            'push constant 7',
        ])

        expect(parser.currentLine).toBe(-1)

        parser.advance()
        expect(parser.currentLine).toBe(0)

        parser.advance()
        expect(parser.currentLine).toBe(1)

        parser.advance()
        expect(parser.currentLine).toBe(2)

        expect(() => parser.advance()).toThrow('No more lines')
    })

    test('skip empty lines', () => {
        const parser = new Parser([
            '',
            'push constant 7',
            '',
            'push constant 7',
        ])

        parser.advance()
        expect(parser.currentLine).toBe(1)

        parser.advance()
        expect(parser.currentLine).toBe(3)
    })

    test('skip comment lines', () => {
        const parser = new Parser([
            '// comment',
            'push constant 7',
            '// comment',
            'push constant 7',
        ])

        parser.advance()
        expect(parser.currentLine).toBe(1)

        parser.advance()
        expect(parser.currentLine).toBe(3)
    })
})

describe('command type', () => {
    test('C_PUSH', () => {
        const parser = new Parser(['push constant 7', 'push temp 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('C_POP', () => {
        const parser = new Parser(['pop constant 7', 'pop temp 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_POP')

        parser.advance()
        expect(parser.commandType()).toBe('C_POP')
    })

    test('C_ARITHMETIC', () => {
        const parser = new Parser([
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ])

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // add

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // sub

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // neg

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // eq

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // gt

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // lt

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // and

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // or

        parser.advance()
        expect(parser.commandType()).toBe('C_ARITHMETIC') // not
    })

    test('C_LABEL', () => {
        const parser = new Parser(['label label1', 'label label2'])

        parser.advance()
        expect(parser.commandType()).toBe('C_LABEL')

        parser.advance()
        expect(parser.commandType()).toBe('C_LABEL')
    })

    test('C_GOTO', () => {
        const parser = new Parser(['goto label1', 'goto label2'])

        parser.advance()
        expect(parser.commandType()).toBe('C_GOTO')

        parser.advance()
        expect(parser.commandType()).toBe('C_GOTO')
    })

    test('C_IF', () => {
        const parser = new Parser(['if-goto label1', 'if-goto label2'])

        parser.advance()
        expect(parser.commandType()).toBe('C_IF')

        parser.advance()
        expect(parser.commandType()).toBe('C_IF')
    })

    test('C_FUNCTION', () => {
        const parser = new Parser(['function label1 0', 'function label2 0'])

        parser.advance()
        expect(parser.commandType()).toBe('C_FUNCTION')

        parser.advance()
        expect(parser.commandType()).toBe('C_FUNCTION')
    })

    test('C_RETURN', () => {
        const parser = new Parser(['return', 'return'])

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')
    })

    test('C_CALL', () => {
        const parser = new Parser(['call label1 0', 'call label2 0'])

        parser.advance()
        expect(parser.commandType()).toBe('C_CALL')

        parser.advance()
        expect(parser.commandType()).toBe('C_CALL')
    })

    test('invalid command', () => {
        const parser = new Parser(['badWord'])

        parser.advance()
        expect(() => parser.commandType()).toThrow(
            'Parse Line Error: Unknown command type "badWord"',
        )
    })
})

describe('arg1()', () => {
    test('push', () => {
        const parser = new Parser(['push constant 7', 'push temp 7'])

        parser.advance()
        expect(parser.arg1()).toBe('constant')

        parser.advance()
        expect(parser.arg1()).toBe('temp')
    })

    test('pop', () => {
        const parser = new Parser(['pop constant 7', 'pop temp 7'])

        parser.advance()
        expect(parser.arg1()).toBe('constant')

        parser.advance()
        expect(parser.arg1()).toBe('temp')
    })

    test('function', () => {
        const parser = new Parser(['function func1', 'function func2'])

        parser.advance()
        expect(parser.arg1()).toBe('func1')

        parser.advance()
        expect(parser.arg1()).toBe('func2')
    })

    test('call', () => {
        const parser = new Parser(['call func1', 'call func2'])

        parser.advance()
        expect(parser.arg1()).toBe('func1')

        parser.advance()
        expect(parser.arg1()).toBe('func2')
    })

    test('label', () => {
        const parser = new Parser(['label label1', 'label label2'])

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('goto', () => {
        const parser = new Parser(['goto label1', 'goto label2'])

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('if-goto', () => {
        const parser = new Parser(['if-goto label1', 'if-goto label2'])

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('arithmetic', () => {
        const parser = new Parser([
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ])

        parser.advance()
        expect(parser.arg1()).toBe('add')

        parser.advance()
        expect(parser.arg1()).toBe('sub')

        parser.advance()
        expect(parser.arg1()).toBe('neg')

        parser.advance()
        expect(parser.arg1()).toBe('eq')

        parser.advance()
        expect(parser.arg1()).toBe('gt')

        parser.advance()
        expect(parser.arg1()).toBe('lt')

        parser.advance()
        expect(parser.arg1()).toBe('and')

        parser.advance()
        expect(parser.arg1()).toBe('or')

        parser.advance()
        expect(parser.arg1()).toBe('not')
    })

    test('return', () => {
        const parser = new Parser(['return'])

        parser.advance()
        expect(() => parser.arg1()).toThrow(
            'Parse Line Error: arg1() for C_RETURN',
        )
    })
})

describe('arg2()', () => {
    test('push', () => {
        const parser = new Parser(['push constant 7', 'push temp 9'])

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('pop', () => {
        const parser = new Parser(['pop constant 7', 'pop temp 9'])

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('function', () => {
        const parser = new Parser(['function func1 7', 'function func2 9'])

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('call', () => {
        const parser = new Parser(['call func1 7', 'call func2 9'])

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('label', () => {
        const parser = new Parser(['label label1'])

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_LABEL',
        )
    })

    test('goto', () => {
        const parser = new Parser(['goto label1'])

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_GOTO',
        )
    })

    test('if-goto', () => {
        const parser = new Parser(['if-goto label1'])

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_IF',
        )
    })

    test('arithmetic', () => {
        const parser = new Parser([
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ])

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_ARITHMETIC',
        )
    })

    test('return', () => {
        const parser = new Parser(['return'])

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_RETURN',
        )
    })
})

describe('handle comments and whitespace', () => {
    test('ignore comment lines', () => {
        const parser = new Parser(['// comment', 'push constant 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('handle inline comments', () => {
        const parser = new Parser([
            '// comment ',
            'push constant 7 // comment',
            'return // comment',
        ])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
        expect(parser.arg1()).toBe('constant')
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')
    })

    test('handle padding whitespace', () => {
        const parser = new Parser([' // comments', '    push constant 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('ignore whitespace lines', () => {
        const parser = new Parser([' ', 'push constant 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('handle empty line', () => {
        const parser = new Parser(['', 'push constant 7'])

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })
})
