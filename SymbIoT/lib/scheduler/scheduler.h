/*
 *  Scheduling Interface - Header File
 *  ------------------------------------
 *  Parses a command from serial
 *  Sends to the appropriate node at the appropriate time
 */ 

#ifndef __Expresso__scheduler__
#define __Expresso__scheduler__

#include <Arduino.h>
#include "string.h"
void scheduler_process(String keyData, String valueData);
void schedulder_parse_key_value(char* serial_buffer, size_t size);

#endif /* defined(__Expresso__scheduler__) */


