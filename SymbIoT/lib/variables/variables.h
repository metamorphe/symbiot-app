
/**
 * This file should be phased out eventually.
 *
 */

#include <Arduino.h>
#include <Wire.h>
#include "BlinkM_funcs.h"

#ifndef Variables_h
#define Variables_h

/* Hard-coded lightscripts for testing purposes */
extern blinkm_script_line script1_lines[];
extern blinkm_script_line script2_lines[];
extern uint8_t script1_len;
extern uint8_t script2_len;

// Basic flash-red script for testing
extern blinkm_script_line flash_red_lines[];
extern uint8_t flash_red_len;


#endif
