#include "test.h"
#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) { return a + b; }

EMSCRIPTEN_KEEPALIVE
char *getStr() { return "hello world"; }

int main()
{
  // printf("WebAssembly 模块已加载！\n");
  test("hello");
  return 0;
}
