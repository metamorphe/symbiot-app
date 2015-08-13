#include "scheduler.h"
//Scheduling variables
// 12 is the maximum length of a decimal representation of a 32-bit integer,
// including space for a leading minus sign and terminating null byte
char scheduler_buffer[12];
String keyData = "";
String valueData = "";
int delimiter = (int) '\n';
int other_delimiter = (int) '\r';
int comma = (int) ',';
bool key = true;


void schedulder_parse_key_value(char* serial_buffer, size_t size, uint16_t this_node) {
    //discard the first command byte
    for(uint8_t i = 1; i < size; i++){
      int ch = serial_buffer[i];

      if(serial_buffer[i] == '\0'){
        break;
      }
      else if (ch == -1) {
        // Handle error
        Serial.println ("Parsing error.");
      }
      else if (ch == comma){
        key = false;
        continue;
      }
      else if (ch == delimiter || ch == other_delimiter) {
        key = true;
        scheduler_process(keyData, valueData, this_node);
        keyData = "";
        valueData = "";
        break;
      }
      else if (key){
        keyData += (char) ch;
      }
      else if(!key){
        valueData += (char) ch;
      }
    }
}


void scheduler_process(String keyData, String valueData, uint16_t this_node){
    unsigned int n = keyData.length() + 1;
    keyData.toCharArray(scheduler_buffer, n);

    int key = atoi(scheduler_buffer);

    /* Convert ASCII-encoded integer to an int */
    n = valueData.length() + 1;
    valueData.toCharArray(scheduler_buffer, n);
    int value = atoi(scheduler_buffer);

    /* Resolve address (address space is base 16) */
    int board = key / 16;
    int addr = key;
    Serial.print("Sending to ");
    Serial.print(addr);
    Serial.print(" with value ");
    Serial.println(value);

    /* Send to network */
    command_set_intensity ((uint16_t) addr, this_node, value);
}
