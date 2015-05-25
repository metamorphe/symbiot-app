#include "nRF24L01.h"
#include "RF24.h"
#include "RF24_config.h"
#include "SPI.h"
int msg[1];
RF24 radio(A0, 10);
const uint64_t pipe = 0xE8E8F0F0E1LL;

void setup(void)
{
   Serial.begin(9600);
   pinMode(A0, OUTPUT);
    radio.begin();
     radio.openWritingPipe(pipe);
}

void loop(void)
{
   
   for (int x=0;x<30;x++)
      {
         msg[0] = x;
          radio.write(msg, 1);
          delay(500);
           }
}
