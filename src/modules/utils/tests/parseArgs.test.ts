import { test, expect } from 'vitest'
import { parseArgs } from '../parseArgs'

test('parseArgs', () => {
    expect(parseArgs(['--arg1=1', '--arg2=2'])).toEqual({
        arg1: '1',
        arg2: '2',
    })
})
