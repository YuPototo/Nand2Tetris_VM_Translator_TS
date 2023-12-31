@256
D=A
@SP
M=D
@Sys.init$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@0
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init$ret.1)


// --- function Main.fibonacci 0 ---
// Main - line 10
(Main.fibonacci)


// --- push argument 0 ---
// Main - line 11
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


// --- push constant 2 ---
// Main - line 12
@2
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- lt                     // checks if n<2 ---
// Main - line 13
@SP
AM=M-1
D=M
@SP
AM=M-1
D=M-D
@Main_lt_TRUE_2
D;JLT
@SP
A=M
M=0
@Main_lt_NOT_TRUE_2
0;JMP
(Main_lt_TRUE_2)
@SP
A=M
M=-1
(Main_lt_NOT_TRUE_2)
@SP
M=M+1


// --- if-goto IF_TRUE ---
// Main - line 14
@SP
AM=M-1
D=M
@IF_TRUE
D;JNE


// --- goto IF_FALSE ---
// Main - line 15
@IF_FALSE
0;JMP


// --- label IF_TRUE          // if n<2, return n ---
// Main - line 16
(IF_TRUE)


// --- push argument 0 ---
// Main - line 17
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


// --- return ---
// Main - line 18
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


// --- label IF_FALSE         // if n>=2, returns fib(n-2)+fib(n-1) ---
// Main - line 19
(IF_FALSE)


// --- push argument 0 ---
// Main - line 20
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


// --- push constant 2 ---
// Main - line 21
@2
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- sub ---
// Main - line 22
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- call Main.fibonacci 1  // computes fib(n-2) ---
// Main - line 23
@Main.fibonacci$ret.3
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$ret.3)


// --- push argument 0 ---
// Main - line 24
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


// --- push constant 1 ---
// Main - line 25
@1
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- sub ---
// Main - line 26
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- call Main.fibonacci 1  // computes fib(n-1) ---
// Main - line 27
@Main.fibonacci$ret.4
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$ret.4)


// --- add                    // returns fib(n-1) + fib(n-2) ---
// Main - line 28
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- return ---
// Main - line 29
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
@256
D=A
@SP
M=D
@Sys.init$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@0
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init$ret.1)


// --- function Sys.init 0 ---
// Sys - line 10
(Sys.init)


// --- push constant 4 ---
// Sys - line 11
@4
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- call Main.fibonacci 1   // computes the 4'th fibonacci element ---
// Sys - line 12
@Main.fibonacci$ret.2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$ret.2)


// --- label WHILE ---
// Sys - line 13
(WHILE)


// --- goto WHILE              // loops infinitely ---
// Sys - line 14
@WHILE
0;JMP
