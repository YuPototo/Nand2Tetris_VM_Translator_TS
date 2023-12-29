import fs from 'fs'

export default function createEmptyFile(path: string): void {
    fs.writeFileSync(path, '', { flag: 'w' })
}
