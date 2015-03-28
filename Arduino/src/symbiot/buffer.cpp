#include "Buffer.h"



//read a string from the serial and store it in an array
//you must supply the array variable
uint8_t readSerialString()
{
  if(!Serial.available()) {
    return 0;
  }
  delay(10);  // wait a little for serial data
  int i = 0;
  while (Serial.available()) {
    serInStr[i] = Serial.read();   // FIXME: doesn't check buffer overrun
    i++;
  }
  serInStr[i] = 0;  // indicate end of read string
  return i;  // return number of chars read
}

void realloc_read_buf(blinkm_script_line *orig_ptr, uint8_t script_len)
{
  READ_BUF = (blinkm_script_line *) realloc(orig_ptr, script_len * sizeof(blinkm_script_line));
  for (int i = 0; i < script_len; i++)
  {
    memset(&READ_BUF[i], 0, sizeof(blinkm_script_line));
  }
}



inline void free_read_buf(blinkm_script_line *buffer, uint8_t script_len){ free(buffer);}
