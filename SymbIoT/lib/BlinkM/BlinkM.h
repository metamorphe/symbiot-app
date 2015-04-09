/*
 *  Actuator Interface - Header File
 *  ------------------------------------
 *  Describes an actuator that receives one signal line (DC || PWM)
 *  An actuator is its own controller; outside controllers activate its behaviors. 
 *  For now, a behavior is defined as a sequence of integers [0, 1000]
 *  It regulates its own voltage thresholds
 */ 
#ifndef __Expresso__blinkm__
#define __Expresso__blinkm__
#include <Arduino.h>


#include "BlinkM_funcs.h"

#define blinkm_addr 0x09 // First port that BlinkM assigns per bean

static int
setup_blinkM (void)
{
  BlinkM_beginWithPower ();
  BlinkM_setAddress (blinkm_addr);
  
  int rc = BlinkM_checkAddress (blinkm_addr);
  
  if( rc == -1 ) 
    Serial.println("\r\nno response");
  else if( rc == 1 )
    Serial.println("\r\naddr mismatch");
  else
  	BlinkM_setStartupParamsDefault (blinkm_addr);

  return -1;
}

#endif /* defined(__Expresso__blinkm__) */
