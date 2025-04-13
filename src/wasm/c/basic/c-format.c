#include "c-format.h"
#include <stdio.h>

// 在C语言中，printf函数中使用的 % 开头的格式化语法被称为格式说明符（Format
// Specifier）或格式控制符（Format Control Character）

void test_format()
{
  int myInt = 10;
  float myFloat = 1.0;
  float myFloatE = 123456789.0;
  double myDouble = 1.0;
  char myChar = 'a';
  char myString[] = "hello";
  int *myPointer = &myInt;
  size_t mySize = sizeof(myInt);

  // 基本类型
  printf("int: %d\n", myInt);
  printf("int (hex): %x\n", myInt);
  printf("int (oct): %o\n", myInt);
  printf("char: %c\n", myChar);
  printf("string: %s\n", myString);
  printf("pointer: %p\n", myPointer);
  printf("size_t类型: %zu\n", mySize);

  // 浮点
  printf("float: %f\n", myFloat);
  printf("float (科学计数): %e\n", myFloat);
  printf("float (大写科学计数): %E\n", myFloat);
  printf("double: %lf\n", myDouble);
  printf("float 智能科学计数法1 (g): %g\n", myFloat);
  printf("float 智能科学计数法2 (g): %g\n", myFloatE);

  // 格式控制
  printf("float (保留2位小数): %.2f\n", myFloat);
  printf("int (左对齐,宽度5): %-5d|\n", myInt);
  printf("int (右对齐,宽度5): %5d|\n", myInt);
  printf("int (补0,宽度5): %05d\n", myInt);

  // 组合使用
  printf("多个参数: %d %f %s\n", myInt, myFloat, myString);
  printf("重复参数: %d %d %d\n", myInt, myInt, myInt);
}
