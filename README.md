# Nand2Tetris VM Translator

This is a VM translator for the Nand2Tetris course. It translates VM code to Hack assembly code.

## Usage

```bash
pnpm dev path/to/folderOrFile
```

A folder path is required. The folder should contain one or more .vm files. The output will be an `.asm` file in the same folder.

If you need comment on asm file:

```bash

pnpm dev path/to/folderOrFile --comment=true

```

if you don't need bootstrap code:

```bash
pnpm dev path/to/folderOrFile --bootstrap=false
```

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

## Specification

### Directory or File

The input can be a directory or a file. If it is a directory, the translator will translate all .vm files in the directory. If it is a file, the translator will translate the file.

Only 1 file is generated.

If the input is a directory, the output file will be named after the directory. `path/to/dir` will generate `dir.asm`.

If the input is a file, the output file will be named after the file. `path/to/file.vm` will generate `file.asm`.

### File Name Convention

The first character of the file name must be an Uppercase letter.

## Todo

- Make cli arg work
- Make it a cli tool
- Add bootstrap code
