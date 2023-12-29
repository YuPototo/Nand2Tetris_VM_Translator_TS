

// --- push constant 10 ---
// BasicTest - line 6
@10
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop local 0 ---
// BasicTest - line 7
@LCL
D=M
@0
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- push constant 21 ---
// BasicTest - line 8
@21
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- push constant 22 ---
// BasicTest - line 9
@22
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop argument 2 ---
// BasicTest - line 10
@ARG
D=M
@2
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- pop argument 1 ---
// BasicTest - line 11
@ARG
D=M
@1
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- push constant 36 ---
// BasicTest - line 12
@36
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop this 6 ---
// BasicTest - line 13
@THIS
D=M
@6
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- push constant 42 ---
// BasicTest - line 14
@42
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- push constant 45 ---
// BasicTest - line 15
@45
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop that 5 ---
// BasicTest - line 16
@THAT
D=M
@5
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- pop that 2 ---
// BasicTest - line 17
@THAT
D=M
@2
D=A+D
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D


// --- push constant 510 ---
// BasicTest - line 18
@510
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop temp 6 ---
// BasicTest - line 19
@SP
AM=M-1
D=M
@11
M=D


// --- push local 0 ---
// BasicTest - line 20
@LCL
D=M
@0
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- push that 5 ---
// BasicTest - line 21
@THAT
D=M
@5
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// BasicTest - line 22
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- push argument 1 ---
// BasicTest - line 23
@ARG
D=M
@1
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- sub ---
// BasicTest - line 24
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- push this 6 ---
// BasicTest - line 25
@THIS
D=M
@6
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- push this 6 ---
// BasicTest - line 26
@THIS
D=M
@6
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// BasicTest - line 27
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- sub ---
// BasicTest - line 28
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- push temp 6 ---
// BasicTest - line 29
@11
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// BasicTest - line 30
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1
