
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


static const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };
static const unsigned int max_script_lines = 255; // max capacity of uint8_t


// /* Temporary variables for presentation*/
static const int beanNum = 0;
static const int buttonInput = 2;
static const int delayButtonInput = 3;
// unsigned long lastPress = 0;


/* Hard-coded lightscripts for testing purposes */
static blinkm_script_line script1_lines[] = {
  { 10, { 'n', 0xfe,0xfe,0xfe}},
  { 5, { 'n', 0x00,0x00,0x00}},
  { 10, { 'n', 0xfe,0xfe,0xfe}},
  { 5, { 'n', 0x00,0x00,0x00}}
};
static blinkm_script_line script2_lines[] = {
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 10, { 'n', 0x00,0xfe,0x00}},
  { 10, { 'n', 0x00,0x00,0xfe}},
  { 1, { 'n', 0x00,0x00,0x00}}
};
static uint8_t script1_len = 4;
static uint8_t script2_len = 4;

// Basic flash-red script for testing
static blinkm_script_line flash_red_lines[] = {
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 5, { 'n', 0x00,0x00,0x00}},
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 5, { 'n', 0x00,0x00,0x00}}
};
static int flash_red_len = 4;


#endif
