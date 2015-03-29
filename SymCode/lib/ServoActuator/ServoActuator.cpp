/*
 *  BlinkMActuator Interface - Header File
 *	------------------------------------
 *  Describes an actuator that receives one signal line (DC || PWM)
 *  An actuator is its own controller; outside controllers activate its behaviors. 
 *  For now, a behavior is defined as a sequence of integers [0, 1000]
 *  It regulates its own voltage thresholds
 */ 
#include "blinkm.h"



 
//
//BlinkMActuator::BlinkMActuator(unsigned int _pin, unsigned int _vmax, unsigned int _vmin) : Actuator{
//  vmin = _vmin; // Arduino 0 --> always off load
//  vmax = _vmax; // Arduino 255 --> always on load
//  value = 0;
//  pos = 0;
//  play = false;
//  repeat = true;
//  init();
//} 

void BlinkMActuator::init(){
  Serial.println("INIT BLINKM");
  BlinkM_beginWithPower();
  BlinkM_stopScript(blinkm_addr);  // turn off startup script
}

void BlinkMActuator::actuate(int _value){
//  Serial.print("actuate blinkm: ");
  int value = map(_value, 0, 1000, vmin, vmax);
//  Serial.println(_value);
  BlinkM_fadeToHSB( blinkm_addr, 80, 255, _value ); 
}

void BlinkMActuator::next(){
	if(!play) return;
	if(repeat && pos >= active_size){
		go_to_pos(0);
        } else if (!repeat && pos >= active_size) {
		playable(false);
		go_to_pos(0);
		return;
	}
        Serial.print("Sending");
        Serial.println(active_behavior[pos]);
	actuate(active_behavior[pos]);
	pos++;
}

void BlinkMActuator::set(unsigned int* _behavior, unsigned int size){
  playable(false);
  active_behavior = _behavior;
  active_size = size;
  go_to_pos(0);
}
