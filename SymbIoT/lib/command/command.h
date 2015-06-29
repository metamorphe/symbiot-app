/**
 * Command.h
 * 
 * Implements commands controlling Beans' actuations directly.
 *
 * Whereas send() and receive() in socket.h handle the transmission of
 * predefined scripts, these commands wrap send() in order to order
 * actuators immediately to a certain state. This is useful for a
 * calling application, particularly the scheduler, to coordinate large
 * amounts of Beans simply.

 * Dependencies: socket.h, BlinkM.h
 * Used by: the Expresso scheduler
 */

#ifndef Command_h
#define Command_h

#include "socket.h"
#include "BlinkM.h"

/* Arguments are as follows:
 * - the address of the destination node
 * - the address of the sender node
 * - in the case of command_set_color and command_fade_to_color, the
 *   next three arguments are the values (from 0 to 255 i.e. 0x00 to
     0xff) of the desired colors. E.g., for all green:
     command_set_color (00, 01, 0x00, 0xff, 0x00);
   - for intensity, the last argument is a number from 0 to 100 which
     corresponds to the percentage of total luminosity that the
     commanded light will output. E.g., for 50% brightness:
     command_set_intensity (00, 01, 50);
 */

void command_discover (uint16_t, uint16_t);

void command_turn_on (uint16_t, uint16_t);
void command_turn_off (uint16_t, uint16_t);
void command_set_intensity (uint16_t, uint16_t, int);
void command_set_color (uint16_t, uint16_t, uint8_t, uint8_t,
						uint8_t);

void command_fade_on (uint16_t, uint16_t);
void command_fade_off (uint16_t, uint16_t);
void command_fade_to_intensity (uint16_t, uint16_t, int);
void command_fade_to_color (uint16_t, uint16_t, uint8_t, uint8_t,
						uint8_t);

void command_self_flash_red (void);
void command_self_flash_green (void);
void command_self_flash_blue (void);
void command_self_flash_yellow (void);
void command_self_flash_white (void);

#endif
