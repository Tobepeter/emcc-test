#include "test.h"
#include <emscripten.h>
#include <stdio.h>

void test_asm_str()
{
  const char *str = "hello";
  EM_ASM({ console.log('test: ' + UTF8ToString($0)); }, str);
}

void test(const char *str)
{
  // printf("test: %s\n", str);
  test_asm_str();
}
