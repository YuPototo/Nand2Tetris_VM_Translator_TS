import fs from 'fs'

type PathInfo = {
    isDir: boolean
    dirPath: string
    baseName: string
    files: string[]
}

export default function checkPath(path: string): PathInfo {
    const pathExists = fs.existsSync(path)

    if (!pathExists) {
        throw new Error(`Path ${path} does not exist`)
    }

    const isDir = isDirectory(path)

    if (isDir) {
        const baseName = extractDirName(path)
        validateName(baseName)

        const files = getValidFiles(path).map((file) => `${path}/${file}`)

        return {
            isDir,
            dirPath: path,
            baseName: baseName,
            files,
        }
    }

    // if path is a file

    if (!isVMFile(path)) {
        throw new Error(`Path ${path} is not a .vm file`)
    }

    const baseName = extractFileBaseName(path)

    validateName(baseName)

    return {
        isDir,
        dirPath: extractPath(path),
        baseName,
        files: [path],
    }
}

export function isDirectory(path: string): boolean {
    try {
        return fs.statSync(path).isDirectory()
    } catch (err) {
        return false
    }
}

export function extractDirName(path: string): string {
    const dirName = path.split('/').pop()
    if (!dirName) {
        throw new Error(`Could not extract directory name from path ${path}`)
    }

    return dirName
}

// extract file base name
// test.vm --> test
export function extractFileBaseName(path: string): string {
    const fileName = path.split('/').pop()
    if (!fileName) {
        throw new Error(`Could not extract file name from path ${path}`)
    }

    return fileName.split('.')[0]
}

export function isVMFile(path: string): boolean {
    return path.endsWith('.vm')
}

/**
 * Get all .vm files in a directory
 * Only base names are returned
 */
export function getValidFiles(path: string): string[] {
    const files = fs.readdirSync(path)
    const validFiles = files.filter((file) => isVMFile(file))

    if (!validFiles.length) {
        throw new Error(`No .vm files found in ${path}`)
    }

    files.forEach(validateName)

    return validFiles
}

export function extractPath(path: string): string {
    const pathArr = path.split('/')
    pathArr.pop()
    return pathArr.join('/')
}

export function validateName(name: string): void {
    // first letter is uppercase
    const firstLetter = name[0]

    if (firstLetter !== firstLetter.toUpperCase()) {
        throw new Error(`${name} does not start with an uppercase letter`)
    }
}
