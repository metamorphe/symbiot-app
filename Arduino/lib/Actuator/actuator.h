/*
 *  Actuator Interface - Header File
 *	------------------------------------
 *  Describes an actuator that receives one signal line (DC || PWM)
 *  An actuator is its own controller; outside controllers activate its behaviors. 
 *  For now, a behavior is defined as a sequence of integers [0, 1000]
 *  It regulates its own voltage thresholds
 */ 
#ifndef __Expresso__actuator__
#define __Expresso__actuator__

#include "string.h"
#include <Arduino.h>
#include <Logger.h>

class Actuator {
  public:
      // name, pin, vmin, max
      Actuator(String, unsigned int, unsigned int, unsigned int) ;
      

      void init();
      void print();
      void set(Logger*);
      void evaluate( SDLogger& _sd);
      /* Function: actuate(value, delay)
       * @params value integer value from 1 - 1000
       * @params # of milliseconds to delay
       */

      void actuate(unsigned int, unsigned long);
      void go_to_pos(int);

      inline void playable(boolean _play){ play = _play; }
      inline void repeatable(boolean _repeat){ repeat = _repeat;}

      inline bool hasNext(){ return repeat || pos >= length() - 1; };
      void next(unsigned long);



      inline uint16_t bound(boolean min){ 
        if(min) return vmin;
        else return vmax;
      }

      inline uint16_t length(){ return active_behavior->length();}
    Logger* active_behavior;
    

  private:
    uint8_t pin;
  
    uint16_t vmax;
    uint16_t vmin;
    uint16_t value;
    uint16_t pos;

    boolean play;
    boolean repeat;
    Logger* internal_log;
    String name;

};

#endif /* defined(__Expresso__actuator__) */
