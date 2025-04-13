#include "stb_ds.h"
#include <emscripten.h>
#include <math.h>
#include <stdio.h>

static int *arr = NULL;

EMSCRIPTEN_KEEPALIVE
void mem_increase()
{
  // NOTE: 其实使用 chrome memory 并不能看到内存变化
  //  因为WebAssembly 使用一个预分配的线性内存(Linear Memory),本质上是一个 ArrayBuffer
  //  这个内存大小在编译时就确定了(可以通过 INITIAL_MEMORY 等参数配置)
  const int count = pow(10, 3);
  const int arrLen = arrlen(arr);
  for (int i = 0; i < count; i++)
  {
    arrput(arr, arrLen + i);
  }

  printf("[mem_increase] arr: %p, arrLen: %d\n", arr, arrLen);
}

EMSCRIPTEN_KEEPALIVE
void mem_free()
{
  printf("[mem_free] arr pointer %p\n", arr);
  arrfree(arr);
}
