export function parseArgs(args: string[]) {
    const parsedArgs: { [key: string]: string } = {}
    args.forEach((arg) => {
        const [key, value] = arg.split('=')
        parsedArgs[key.replace('--', '')] = value
    })
    return parsedArgs
}
