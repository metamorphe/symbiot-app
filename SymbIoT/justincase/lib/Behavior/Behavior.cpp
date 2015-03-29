/**
 * Behavior.cpp
 * 
 * More info goes here
 *
 * Dependencies:
 *
 */

#include "Behavior.h"
#include "Arduino.h"

Behavior::Behavior(blinkm_script_line *scriptArr[]) {
  _scriptArr = (blinkm_script_line *) malloc (MAX_NUM_LINES * sizeof(
                                              blinkm_script_line));
  if (_scriptArr == NULL) {
    Serial.println("Error: could not allocate script array.");
  }

  for (int i = 0; i < MAX_NUM_LINES; i++) {
    _scriptArr[i] = *(scriptArr[i]);
  }
}

void Behavior::setLine(uint8_t index, blinkm_script_line *line) {
  if (index < 0 || index >= MAX_NUM_LINES) {
    Serial.println("Error: invalid index for setting line.");
  }
  else {
    _scriptArr[index] = *line;
  }
}

blinkm_script_line *Behavior::getLine(uint8_t index) {
  if (index < 0 || index >= MAX_NUM_LINES) {
    Serial.println("Error: invalid index for getting line.");
    return NULL;
  }
  else {
    return &_scriptArr[index];
  }
}