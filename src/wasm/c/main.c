#include "test.h"
#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) { return a + b; }

EMSCRIPTEN_KEEPALIVE
char *getStr() { return "hello world"; }

EMSCRIPTEN_KEEPALIVE
void triggerEmCallback()
{
  // TODO: 貌似访问ts的一开始默认不能执行（不能放到main内），不知道什么原因
  const char *str = "triggerEmCallback123";

  // NOTE: 如果只有一行代码，大括号可以省略
  // EM_ASM({ window.emCallback.track($0); }, str);
  EM_ASM(window.emCallback.track($0), str);
}

int main()
{
  // printf("WebAssembly 模块已加载！\n");
  test();
  return 0;
}
