#include "emcc-emjs.h"
#include <emscripten.h>
#include <stdio.h>

// NOTE：使用 EM_ASM有一个缺点，即使是内容一样，也会构建不同的函数地址
EM_JS(void, test_emjs_console, (), { console.log("test emjs"); });

EM_JS(int, test_emjs_int, (), { return 123; });

EM_JS(int, test_emjs_int_param, (int a, int b), { return a + b; });

// NOTE: 胶水代码中有这个内置函数，可以直接使用
EM_JS(void, test_emjs_str_param, (char *str), { console.log(UTF8ToString(str)); });

void test_emjs() {
  test_emjs_console();
  const int a = test_emjs_int();
  printf("test_emjs_int: %d\n", a);
  const int b = test_emjs_int_param(1, 2);
  printf("test_emjs_int_param: %d\n", b);
  test_emjs_str_param("hello world");
}