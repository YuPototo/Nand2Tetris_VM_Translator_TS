

// --- push constant 2 ---
// FileOne - line 0
@2
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- add ---
// FileOne - line 1
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D+M
@SP
M=M+1


// --- sub ---
// FileOne - line 2
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
@SP
M=M+1


// --- neg ---
// FileOne - line 3
@SP
AM=M-1
M=-M
@SP
M=M+1


// --- eq ---
// FileOne - line 4
@SP
AM=M-1
D=M
@SP
AM=M-1
D=M-D
@FileOne_eq_TRUE_1
D;JEQ
@SP
A=M
M=0
@FileOne_eq_NOT_TRUE_1
0;JMP
(FileOne_eq_TRUE_1)
@SP
A=M
M=-1
(FileOne_eq_NOT_TRUE_1)
@SP
M=M+1


// --- gt ---
// FileOne - line 5
@SP
AM=M-1
D=M
@SP
AM=M-1
D=M-D
@FileOne_gt_TRUE_2
D;JGT
@SP
A=M
M=0
@FileOne_gt_NOT_TRUE_2
0;JMP
(FileOne_gt_TRUE_2)
@SP
A=M
M=-1
(FileOne_gt_NOT_TRUE_2)
@SP
M=M+1


// --- lt ---
// FileOne - line 6
@SP
AM=M-1
D=M
@SP
AM=M-1
D=M-D
@FileOne_lt_TRUE_3
D;JLT
@SP
A=M
M=0
@FileOne_lt_NOT_TRUE_3
0;JMP
(FileOne_lt_TRUE_3)
@SP
A=M
M=-1
(FileOne_lt_NOT_TRUE_3)
@SP
M=M+1


// --- and ---
// FileOne - line 7
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D&M
@SP
M=M+1


// --- or ---
// FileOne - line 8
@SP
AM=M-1
D=M
@SP
AM=M-1
M=D|M
@SP
M=M+1


// --- not ---
// FileOne - line 9
@SP
AM=M-1
M=!M
@SP
M=M+1


// --- push constant 2 ---
// FileTwo - line 0
@2
D=A
@SP
A=M
M=D
@SP
M=M+1


// --- pop local 0 ---
// FileTwo - line 1
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


// --- push temp 3 ---
// FileTwo - line 2
@8
D=M
@SP
A=M
M=D
@SP
M=M+1
