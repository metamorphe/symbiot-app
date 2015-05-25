#include "nRF24L01.h"
#include "RF24.h"
#include "RF24_config.h"
#include "SPI.h"


int msg[1];
RF24 radio(A0,10);
const uint64_t pipe = 0xE8E8F0F0E1LL;
int lastmsg = 1;

void setup(void)
{
   Serial.begin(9600);
   pinMode(A0, OUTPUT);
    radio.begin();
     radio.openReadingPipe(1,pipe);
      radio.startListening();

}

void loop(void)
{
   if (radio.available())
      {
           bool done = false;  
              while (!done)
                   {
                          done = radio.read(msg, 2); 
                               Serial.println(msg[0]);
                               delay(500);
                                  }
               }
}

