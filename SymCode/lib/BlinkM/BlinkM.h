


/*
 *  Actuator Interface - Header File
 *  ------------------------------------
 *  Describes an actuator that receives one signal line (DC || PWM)
 *  An actuator is its own controller; outside controllers activate its behaviors. 
 *  For now, a behavior is defined as a sequence of integers [0, 1000]
 *  It regulates its own voltage thresholds
 */ 
#ifndef __Expresso__blinkm__
#define __Expresso__blinkm__
#include <Arduino.h>


#include "BlinkM_funcs.h"
typedef struct _lightscript_header {
  uint8_t num_lines;
  uint8_t delay_sec;
} lightscript_header;

#endif /* defined(__Expresso__blinkm__) */
