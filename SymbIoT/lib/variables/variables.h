
/**
 * config.h
 * 
 * More info goes here
 *
 */

#include <Arduino.h>
#include <Wire.h>
#include "BlinkM_funcs.h"

#ifndef config_h
#define config_h

// /* Config */
// #define BLINKM_FUNCS_DEBUG 1

#define blinkm_addr 0x09 // First port that BlinkM assigns per bean


extern const uint64_t pipes[2];
extern const unsigned int max_script_lines; // max capacity of uint8_t


// /* Temporary variables for presentation*/
extern const int beanNum;
extern const int buttonInput;
extern const int delayButtonInput;
extern unsigned long lastPress;


/* Hard-coded lightscripts for testing purposes */
extern blinkm_script_line script1_lines[];
extern blinkm_script_line script2_lines[];
extern uint8_t script1_len;
extern uint8_t script2_len;

// Basic flash-red script for testing
extern blinkm_script_line flash_red_lines[];
extern int flash_red_len;


#endif
