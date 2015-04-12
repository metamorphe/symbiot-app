#include <Arduino.h>
#include "variables.h"
#include "BlinkM.h"
#include "socket.h"
#include "scheduler.h"

#define IS_DIGIT(c) ((c >= '0' && c <= '9') ? 1 : 0)
#define SERIAL_BUFFER_SIZE 32
#include "printf.h"

/* Function prototypes. */
void welcome_message(void);
uint8_t readSerialString (void);
void actuate (void);

uint16_t this_node;


/* Main Code */

void 
welcome_message(void)
{
  printf_P (PSTR ("Welcome to address-finder test suite."));
}

void setup()
{
  /* Begin all communication, read EEPROM, and print address. */
  Serial.begin (19200);
  printf_begin ();
  welcome_message ();

  while(1)
  {
    nodeconfig_listen();
  }
}

void loop()
{

}
