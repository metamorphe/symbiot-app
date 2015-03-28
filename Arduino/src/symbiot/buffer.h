/**
 * Buffer.h
 * 
 * String buffer methods
 *
 */

#ifndef Buffer_h
#define Buffer_h

#include "BlinkM_funcs.h"

lightscript_header *READ_HEAD_BUF;
blinkm_script_line *READ_BUF;
char serInStr[30];  // array that will hold the serial input string


/* Utility functions */
void realloc_read_buf(blinkm_script_line *orig_ptr, uint8_t script_len);
void free_read_buf(blinkm_script_line *buffer, uint8_t script_len);


/*  Stores a string in a buffer for serial reading. Uses serInStr for buffer. */
uint8_t readSerialString(void);

#endif
