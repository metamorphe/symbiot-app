


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
#include <Wire.h>

#include "actuator.h"
#include "string.h"
#include "BlinkM_funcs.h"
#define blinkm_addr 0x00


class BlinkMActuator : public Actuator{
  public:
      BlinkMActuator(unsigned int _pin , unsigned int _vmin, unsigned int _vmax) : Actuator(_pin, _vmin, _vmax){
      };
      void init();
      void set(unsigned int*, unsigned int);
      void actuate(int);
      void next();

  private:
    unsigned int* active_behavior;
    unsigned int active_size;
    unsigned int pin;
  
    unsigned int vmax;
    unsigned int vmin;
    unsigned int value;
    int pos;
};

#endif /* defined(__Expresso__blinkm__) */
