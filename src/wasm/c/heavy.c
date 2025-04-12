#include <emscripten.h>
#include <stdio.h>
#include <math.h>

int heavy_indirect()
{
  // NOTE: chrome performance 只能看到胶水代码对外的部分，里面的看不到了
  //  不过如果开启了 --profiling，c的代码会跑到胶水代码里面了，可以看到性能信息
  int result = 0;

  const int count = pow(10, 8);
  printf("running heavy task, count: %d\n", count);
  for (int i = 0; i < count; i++)
  {
    result += i;
  }
  return result;
}

EMSCRIPTEN_KEEPALIVE
int heavy() { return heavy_indirect(); }
