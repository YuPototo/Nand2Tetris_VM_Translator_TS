import { parseArgs } from './utils/parseArgs'

export default function checkArg(args: string[]) {
    const { comment, bootstrap } = parseArgs(args)

    let withComment
    let withBootstrap

    if (comment === 'false' || comment === undefined) {
        withComment = false
    } else if (comment === 'true') {
        withComment = true
    } else {
        throw new Error('Invalid comment argument')
    }

    if (bootstrap === 'true' || bootstrap === undefined) {
        withBootstrap = true
    } else if (bootstrap === 'false') {
        withBootstrap = false
    } else {
        throw new Error('Invalid bootstrap argument')
    }

    return {
        withComment,
        withBootstrap,
    }
}
