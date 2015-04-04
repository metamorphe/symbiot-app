// Interpreter H File

/**
 * Interpreter.h
 * 
 * Main application code for the Expresso Bean
 *
 */
/* BlinkM dependencies */

#ifndef Socket_h
#define Socket_h

#include "Wire.h"
#include "BlinkM.h"


/* rF dependencies */
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "RF24Network.h"
#include "nodeconfig.h"

/* Structs and enums */
#include "variables.h"
#include "buffer.h"

extern blinkm_script_line buffer[16];
extern RF24NetworkHeader *most_recent_header;
extern uint8_t num_lines;

/* Setup functions */
int setup_blinkM ();
int setup_radio (uint16_t);
int setup_buffer (size_t);

/* Main functions */
void send (uint16_t, uint16_t, blinkm_script_line *, uint8_t);
int receive ();

#endif
