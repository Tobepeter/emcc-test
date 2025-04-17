#ifndef EMCC_MALLOC_H
#define EMCC_MALLOC_H

#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include "../em-callback.h"

#ifndef DEBUG
// NOTE: 其实我不想替换默认的 malloc 和 free
//  但是实在是没办法有比较好的监控方式了，emcc的 tracing.h 非常老
//  -s MALLOC=emmalloc-verbose 又会轰炸控制台
//  试了很多办法，都不能很好的替换c的malloc函数，只能这么做了
#define mallocX(size) malloc(size)
#define freeX(ptr) free(ptr)
#define callocX(nmemb, size) calloc(nmemb, size)
#define reallocX(ptr, size) realloc(ptr, size)
#else
#define mallocX(size) ({ \
  void *ptr = malloc(size); \
  em_notifyAdd(ptr, size); \
  ptr; \
})

#define freeX(ptr) { \
  em_notifyRemove(ptr); \
  free(ptr); \
}

// TODO: realloc 和 calloc 暂时没测试
#define reallocX(ptr, size) ({ \
  em_notifyRemove(ptr); \
  void *new_ptr = realloc(ptr, size); \
  em_notifyAdd(new_ptr, size); \
  new_ptr; \
})

#define callocX(nmemb, size) ({ \
  void *ptr = calloc(nmemb, size); \
  em_notifyAdd(ptr, nmemb * size); \
  ptr; \
})
#endif

#endif
