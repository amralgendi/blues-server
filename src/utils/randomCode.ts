export default (): string => {
    const code: number[] = []
    for (let i = 0; i < 4; i++) {
        code[i] = Math.floor(Math.random() * 10)
    }
    return code.join('')
}
