

// --- function SimpleFunction.test 2 ---
// SimpleFunction - line 6
(SimpleFunction.test)
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
@0
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- push local 0 ---
// SimpleFunction - line 7
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


// --- push local 1 ---
// SimpleFunction - line 8
@LCL
D=M
@1
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// SimpleFunction - line 9
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- not ---
// SimpleFunction - line 10
@SP
AM=M-1
M=!M
@SP
M=M+1


// --- push argument 0 ---
// SimpleFunction - line 11
@ARG
D=M
@0
A=A+D
D=M
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// SimpleFunction - line 12
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- push argument 1 ---
// SimpleFunction - line 13
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
// SimpleFunction - line 14
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- return ---
// SimpleFunction - line 15
@LCL
D=M
@R13
M=D
@R13
D=M
@5
A=D-A
D=M
@R14
M=D
@ARG
D=M
@R15
M=D
@SP
AM=M-1
D=M
@R15
A=M
M=D
@ARG
D=M+1
@SP
M=D
@R13
D=M
@1
A=D-A
D=M
@THAT
M=D
@R13
D=M
@2
A=D-A
D=M
@THIS
M=D
@R13
D=M
@3
A=D-A
D=M
@ARG
M=D
@R13
D=M
@4
A=D-A
D=M
@LCL
M=D
@R14
A=M
0;JMP
