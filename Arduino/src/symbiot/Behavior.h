/**
 * Behavior.h
 * 
 * More info goes here
 *
 */

#ifndef Behavior_h
#define Behavior_h

#include "Arduino.h"
#include "BlinkM_funcs.h"

#define MAX_NUM_LINES 256

class Behavior {

  public:
    Behavior(blinkm_script_line **);
    void setLine(uint8_t, blinkm_script_line *);
    blinkm_script_line *getLine(uint8_t);
  
  private:
    /* Stores a copy of an array of length MAX_NUM_LINES where each
       cell contains a blinkm_script_line struct. */
    blinkm_script_line *_scriptArr;

};

#endif
