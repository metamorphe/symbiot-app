// Interpreter H File

/**
 * Interpreter.h
 * 
 * Main application code for the Expresso Bean
 *
 */

#ifndef Interpreter_h
#define Interpreter_h


/* BlinkM dependencies */
#include "Wire.h"
#include "BlinkM_funcs.h"
 #include "buffer.h"


/* rF dependencies */
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"


/* Structs and enums */
typedef struct _lightscript_header {
  uint8_t num_lines;
  uint8_t delay_sec;
} lightscript_header;

typedef enum { 
	role_ping_out = 1, 
	role_pong_back 
} role_e;


/* Setup functions */
static void setup_blinkM();
static void setup_radio();

/* Main functions */
void send(blinkm_script_line *script_lines, uint8_t script_len, uint8_t delay_sec);
void receive();





#endif
