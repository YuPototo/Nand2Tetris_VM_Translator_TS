import { CommandType } from '../types'

interface ICodeWriter {
    withComment: boolean
}

export default class CodeWriter implements ICodeWriter {
    withComment: boolean = false

    constructor(withComment: boolean) {
        this.withComment = withComment
    }
}
