/**
 * Buffer.h
 * 
 * String buffer methods
 *
 */
#include "BlinkM.h"


#ifndef Buffer_h
#define Buffer_h

extern lightscript_header *READ_HEAD_BUF;
extern blinkm_script_line *READ_BUF;
extern char serInStr[30];

// /* Utility functions */
void realloc_read_buf(blinkm_script_line *orig_ptr, uint8_t script_len);
void free_read_buf(blinkm_script_line *buffer, uint8_t script_len);


// /*  Stores a string in a buffer for serial reading. Uses serInStr for buffer. */
uint8_t readSerialString();

#endif
