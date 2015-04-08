#include "scheduler.h"
//Scheduling variables 
// 12 is the maximum length of a decimal representation of a 32-bit integer,
// including space for a leading minus sign and terminating null byte
char scheduler_buffer[12];
String keyData = "";
String valueData = "";
int delimiter = (int) '\n';
int comma = (int) ',';
bool key = true;


void schedulder_parse_key_value(char* serial_buffer, size_t size) {
    //discard the first command byte
    for(uint8_t i = 1; i < size; i++){
      
      int ch = serial_buffer[i];

      if(serial_buffer[i] == '\0'){
        break;
      }
      else if (ch == -1) {
        // Handle error
      }
      else if (ch == comma){
        key = false;
        break;
      }
      else if (ch == delimiter) {
        key = true;
        scheduler_process(keyData, valueData);
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


void scheduler_process(String keyData, String valueData){
    unsigned int n = keyData.length() + 1;
    keyData.toCharArray(scheduler_buffer, n);
   
    int key = atoi(scheduler_buffer);

    // Convert ASCII-encoded integer to an int
    n = valueData.length() + 1;
    valueData.toCharArray(scheduler_buffer, n);
    int value = atoi(scheduler_buffer);


    // value = map(value, 0, 1000, 0, 255);
    value = constrain(value, 0, 4096);
    value = map(value, 0, 1001, 0, 500);
    

    // SEND TO CORRECT NODE 

    // RESOLVE ADDRESS (ADDRESS SPACE IS BASE 16)
    int board = key / 16;
    int addr = key % 16;
    Serial.print("Sending to ");
    Serial.print(addr);
    Serial.print("with value ");
    Serial.println(value);


    // JASPER:
    // NETWORK COMMAND GOES HERE
    // send(addr, from_addr, command_syntax_i_do_not_know);

    // value = map(value, 0, 1001, 0, 4096);
    
    // Serial.println(value);
    // analogWrite(key, value);
    
   
    
    // if(board == 0)
    //   light_a.setPWM(addr, 0, value);
    // else if(board == 1)
    //   light_b.setPWM(addr, 0, value);
    // else if(board == 2){
      
    //   value = map(value, 0, 1001, 150, 525);
    //   // light_a.setPWM(0, 0, value);
    //   servos.setPWM(addr, 0, value);
}

