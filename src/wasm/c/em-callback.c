#include "em-callback.h"
#include <emscripten.h>

EM_JS(void, em_track, (const char *str), { window.emCallback.track(UTF8ToString(str)); });

EM_JS(void, em_notifyAdd, (void *ptr, int size), { window.emCallback.notifyAdd(ptr, size); });

EM_JS(void, em_notifyRemove, (void *ptr), { window.emCallback.notifyRemove(ptr); });