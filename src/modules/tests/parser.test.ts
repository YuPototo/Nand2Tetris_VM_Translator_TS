import Parser from '../parser'

import { expect, test, describe } from 'vitest'

test('init parser', () => {
    const lines = ['push constant 7', 'push constant 7', 'push constant 7']
    const input = lines.join('\n')
    const parser = new Parser(input)

    expect(parser.currentIndex).toBe(-1)
    expect(parser.lines.length).toBe(3)
})

describe('advance()', () => {
    test('simple advance', () => {
        const lines = ['push constant 7', 'push constant 7', 'push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        expect(parser.currentIndex).toBe(-1)

        parser.advance()
        expect(parser.currentIndex).toBe(0)

        parser.advance()
        expect(parser.currentIndex).toBe(1)

        parser.advance()
        expect(parser.currentIndex).toBe(2)

        expect(() => parser.advance()).toThrow('No more lines')
    })

    test('No more line error', () => {
        const lines = ['push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.advance()).toThrow('No more lines')
    })
})

describe('command type', () => {
    test('C_PUSH', () => {
        const lines = ['push constant 7', 'push temp 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('C_POP', () => {
        const lines = ['pop constant 7', 'pop temp 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_POP')

        parser.advance()
        expect(parser.commandType()).toBe('C_POP')
    })

    test('C_ARITHMETIC', () => {
        const lines = [
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ]
        const input = lines.join('\n')
        const parser = new Parser(input)

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
        const lines = ['label label1', 'label label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_LABEL')

        parser.advance()
        expect(parser.commandType()).toBe('C_LABEL')
    })

    test('C_GOTO', () => {
        const lines = ['goto label1', 'goto label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_GOTO')

        parser.advance()
        expect(parser.commandType()).toBe('C_GOTO')
    })

    test('C_IF', () => {
        const lines = ['if-goto label1', 'if-goto label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_IF')

        parser.advance()
        expect(parser.commandType()).toBe('C_IF')
    })

    test('C_FUNCTION', () => {
        const lines = ['function label1 0', 'function label2 0']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_FUNCTION')

        parser.advance()
        expect(parser.commandType()).toBe('C_FUNCTION')
    })

    test('C_RETURN', () => {
        const lines = ['return', 'return']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')
    })

    test('C_CALL', () => {
        const lines = ['call label1 0', 'call label2 0']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_CALL')

        parser.advance()
        expect(parser.commandType()).toBe('C_CALL')
    })

    test('invalid command', () => {
        const lines = ['badWord']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.commandType()).toThrow(
            'Parse Line Error: Unknown command type "badWord"',
        )
    })
})

describe('arg1()', () => {
    test('push', () => {
        const lines = ['push constant 7', 'push temp 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('constant')

        parser.advance()
        expect(parser.arg1()).toBe('temp')
    })

    test('pop', () => {
        const lines = ['pop constant 7', 'pop temp 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('constant')

        parser.advance()
        expect(parser.arg1()).toBe('temp')
    })

    test('function', () => {
        const lines = ['function func1', 'function func2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('func1')

        parser.advance()
        expect(parser.arg1()).toBe('func2')
    })

    test('call', () => {
        const lines = ['call func1', 'call func2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('func1')

        parser.advance()
        expect(parser.arg1()).toBe('func2')
    })

    test('label', () => {
        const lines = ['label label1', 'label label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('goto', () => {
        const lines = ['goto label1', 'goto label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('if-goto', () => {
        const lines = ['if-goto label1', 'if-goto label2']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg1()).toBe('label1')

        parser.advance()
        expect(parser.arg1()).toBe('label2')
    })

    test('arithmetic', () => {
        const lines = [
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ]
        const input = lines.join('\n')
        const parser = new Parser(input)

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
        const lines = ['return']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.arg1()).toThrow(
            'Parse Line Error: arg1() for C_RETURN',
        )
    })
})

describe('arg2()', () => {
    test('push', () => {
        const lines = ['push constant 7', 'push temp 9']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('pop', () => {
        const lines = ['pop constant 7', 'pop temp 9']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('function', () => {
        const lines = ['function func1 7', 'function func2 9']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('call', () => {
        const lines = ['call func1 7', 'call func2 9']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.arg2()).toBe(9)
    })

    test('label', () => {
        const lines = ['label label1']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_LABEL',
        )
    })

    test('goto', () => {
        const lines = ['goto label1']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_GOTO',
        )
    })

    test('if-goto', () => {
        const lines = ['if-goto label1']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_IF',
        )
    })

    test('arithmetic', () => {
        const lines = [
            'add',
            'sub',
            'neg',
            'eq',
            'gt',
            'lt',
            'and',
            'or',
            'not',
        ]
        const input = lines.join('\n')
        const parser = new Parser(input)

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
        const lines = ['return']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(() => parser.arg2()).toThrow(
            'Parse Line Error: arg2() should NOT be called for C_RETURN',
        )
    })
})

describe('handle comments and whitespace', () => {
    test('ignore comment lines', () => {
        const lines = ['// comment', 'push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('handle inline comments', () => {
        const lines = [
            '// comment ',
            'push constant 7 // comment',
            'return // comment',
        ]
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
        expect(parser.arg1()).toBe('constant')
        expect(parser.arg2()).toBe(7)

        parser.advance()
        expect(parser.commandType()).toBe('C_RETURN')
    })

    test('handle padding whitespace', () => {
        const lines = [' // comments', '    push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('ignore whitespace lines', () => {
        const lines = [' ', 'push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })

    test('handle empty line', () => {
        const lines = ['', 'push constant 7']
        const input = lines.join('\n')
        const parser = new Parser(input)

        parser.advance()
        expect(parser.commandType()).toBe('C_PUSH')
    })
})
