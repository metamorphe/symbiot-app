/*
 Copyright (C) 2011 James Coliz, Jr. <maniacbug@ymail.com>

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 version 2 as published by the Free Software Foundation.
 */

#include "RF24Network_config.h"
#include <avr/eeprom.h>
#include <avr/pgmspace.h>
#include "nodeconfig.h"

// Where in EEPROM is the address stored?
uint8_t* address_at_eeprom_location = (uint8_t*)10;

// What flag value is stored there so we know the value is valid?
const uint8_t valid_eeprom_flag = 0xdf;

// What are the actual node values that we want to use?
// EEPROM locations are actually just indices into this array
const uint16_t node_address_set[16] =
{
  00,
  01, 011, 021,
  02, 012, 022,
  03, 013, 023,
  04, 014, 024,
  05, 015, 025
};

uint8_t nodeconfig_read(void)
{
  uint8_t result = 0;

  // Look for the token in EEPROM to indicate the following value is
  // a validly set node address 
  if ( eeprom_read_byte(address_at_eeprom_location) == valid_eeprom_flag )
  {
    // Read the address from EEPROM
    result = node_address_set[ eeprom_read_byte(address_at_eeprom_location+1) ];
    printf_P(PSTR("ADDRESS: %u\n\r"),result);
  }
  else
  {
    printf_P(PSTR("*** No valid address found.  Send 0-f via serial to set node address\n\r"));
    while(1)
    {
      nodeconfig_listen();
    }
  }
  
  return result;
}

void nodeconfig_listen(void)
{
  //
  // Listen for serial input, which is how we set the address
  //
  if (Serial.available())
  {
    // If the character on serial input is in a valid range...
    char c = Serial.read();
    if ( (c >= '0' && c <= '9') || c == 'a' || c == 'b' || c == 'c'
         || c == 'd' || c == 'e' || c == 'f')
    {
      int index;
      if (c >= '0' && c <= '9')
        index = c - '0';
      else
      {
        switch (c)
        {
          case 'a':
            index = 10;
            break;
          case 'b':
            index = 11;
            break;
          case 'c':
            index = 12;
            break;
          case 'd':
            index = 13;
            break;
          case 'e':
            index = 14;
            break;
          case 'f':
            index = 15;
            break;
          default:
            index = 0;
        }
      }
      // It is our address
      eeprom_write_byte(address_at_eeprom_location,valid_eeprom_flag);
      eeprom_write_byte(address_at_eeprom_location+1, index);

      // And we are done right now (no easy way to soft reset)
      printf_P(PSTR("\n\rManually reset index to: %d, address 0%o\n\rPress RESET to continue!"),index,node_address_set[index]);
      while(1);
    }
  }
}
// vim:ai:cin:sts=2 sw=2 ft=cpp
