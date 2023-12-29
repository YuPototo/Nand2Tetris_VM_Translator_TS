import { test, expect } from 'vitest'
import {
    isDirectory,
    extractDirName,
    extractFileBaseName,
    isVMFile,
    extractPath,
} from '../checkPath'

test('isDirectory', () => {
    expect(isDirectory('./src/modules/utils')).toBe(true)
    expect(isDirectory('./src/modules/utils/checkPath.test.ts')).toBe(false)
})

test('extractDirName', () => {
    expect(extractDirName('/path')).toBe('path')
    expect(extractDirName('/path/to')).toBe('to')
    expect(extractDirName('/path/to/example')).toBe('example')
})

test('extractFileBaseName', () => {
    expect(extractFileBaseName('/path/to/example.vm')).toBe('example')
    expect(extractFileBaseName('/path/to/test.vm')).toBe('test')
})

test('isVMFile', () => {
    expect(isVMFile('/path/to/example.vm')).toBe(true)
    expect(isVMFile('/path/to/test')).toBe(false)
})

test('extractPath', () => {
    expect(extractPath('/path/to/example.vm')).toBe('/path/to')
    expect(extractPath('/path/to/test')).toBe('/path/to')
})
