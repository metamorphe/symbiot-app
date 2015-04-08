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
#include "command.h"

void scheduler_process(String, String, uint16_t);
void schedulder_parse_key_value(char *, size_t, uint16_t);

#endif /* defined(__Expresso__scheduler__) */


