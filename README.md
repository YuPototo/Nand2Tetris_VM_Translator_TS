# Nand2Tetris VM Translator

This is a VM translator for the Nand2Tetris course. It translates VM code to Hack assembly code.

## Usage

```bash
pnpm dev path/to/folder
```

A folder path is required. The folder should contain one or more .vm files. The output will be a `source.asm` file in the same folder.

## Unit Tests

Unit tests are provided to facilitate refactor.

```bash
pnpm test
```

## Integration Tests

Integration tests should be run against the VM emulator provided by the Nand2Tetris course.

Refer to the [Nand2Tetris website](https://www.nand2tetris.org/software) and following instruction materials:

- Project 7
- Project 8
