// Interpreter H File

/**
 * Interpreter.h
 * 
 * Main application code for the Expresso Bean
 *
 */
/* BlinkM dependencies */
#include "Wire.h"
#include "BlinkM_funcs.h"


/* rF dependencies */
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"




#ifndef Interpreter_h
#define Interpreter_h

/* Structs and enums */
#include "util/variables.h"
#include "buffer.h"

typedef enum { 
	role_ping_out = 1, 
	role_pong_back 
} role_e;


/* Setup functions */
int setup_blinkM();
int setup_radio();
int setup_buffer(size_t);

/* Main functions */
void send(blinkm_script_line *script_lines, uint8_t script_len, uint8_t delay_sec);
void receive();





#endif
