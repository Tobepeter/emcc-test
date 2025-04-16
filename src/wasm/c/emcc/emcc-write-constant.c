#include <emscripten.h>
#include <stdio.h>

static const char *helloStr = "Hello";

/**

emcc有一个致命缺点，可以不小心修改常量区
应该是实际运行环境是js分配的bufffer，是没有严格的常量区的
C语言运行时修改常量区是会报错的

打印 Hello World \n，这里额外多了一个 \n ，和原始字符串不是同一个不影响

*/

EMSCRIPTEN_KEEPALIVE
void test_emcc_write_constant()
{
  // NOTE: 防止老是构建警告，先注释掉了

  // printf("helloStr ptr: %p\n", helloStr);
  // printf("Hello ptr: %p\n", "Hello");

  // void *p = helloStr;
  // *((char *)p) = 'T';
  // printf("helloStr: %s\n", helloStr);
  // printf("%s\n", "Hello");
  // printf("Hello\n");
}
