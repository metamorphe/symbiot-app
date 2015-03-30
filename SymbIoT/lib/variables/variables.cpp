#include "variables.h"

// #define BLINKM_FUNCS_DEBUG 1

 const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };
 const unsigned int max_script_lines = 255; // max capacity of uint8_t


// /* Temporary variables for presentation*/
 const int beanNum = 0;
 const int buttonInput = 2;
 const int delayButtonInput = 3;
 unsigned long lastPress = 0;


/* Hard-coded lightscripts for testing purposes */
blinkm_script_line script1_lines[] = {
  { 10, { 'n', 0xfe,0xfe,0xfe}},
  { 5, { 'n', 0x00,0x00,0x00}},
  { 10, { 'n', 0xfe,0xfe,0xfe}},
  { 5, { 'n', 0x00,0x00,0x00}}
};
blinkm_script_line script2_lines[] = {
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 10, { 'n', 0x00,0xfe,0x00}},
  { 10, { 'n', 0x00,0x00,0xfe}},
  { 1, { 'n', 0x00,0x00,0x00}}
};
uint8_t script1_len = 4;
uint8_t script2_len = 4;

// Basic flash-red script for testing
blinkm_script_line flash_red_lines[] = {
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 5, { 'n', 0x00,0x00,0x00}},
  { 10, { 'n', 0xfe,0x00,0x00}},
  { 5, { 'n', 0x00,0x00,0x00}}
};

int flash_red_len = 4;

