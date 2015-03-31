#include "interpreter.h"

#define TIMEOUT 3000

/* rF configuration */
RF24 radio(9,10); 

const char* role_friendly_name[] = { "invalid", "Ping out", "Pong back"};
// Set default role
role_e role = role_pong_back;


int setup_blinkM()
{
    BlinkM_beginWithPower();
    BlinkM_setAddress( blinkm_addr );
    
    Serial.begin(19200); 
    int rc = BlinkM_checkAddress( blinkm_addr );
    
    if( rc == -1 ) 
        Serial.println("\r\nno response");
    else if( rc == 1 ) 
        Serial.println("\r\naddr mismatch");

    return -1;
}

int setup_radio()
{
    radio.begin();
    radio.setRetries(15,15);
    // Become the primary receiver (pong back)
    role = role_pong_back;
    radio.openWritingPipe(pipes[1]);
    radio.openReadingPipe(1,pipes[0]);
    radio.startListening();
    return 1;
}


int setup_buffer(size_t bytes){
  READ_HEAD_BUF = (lightscript_header *) malloc(bytes);
  return (!READ_HEAD_BUF) ? -1 : 1;
}

// wait for header first!
void receive()
{
  if (!radio.available()) { return; }
  Serial.println("Receiving.");
  /* Check header */
  bool found_header = false;
  while (!found_header)
  {
    //Serial.println("Attempting to read header...");
    found_header = radio.read( READ_HEAD_BUF, sizeof(lightscript_header));
  }
  uint8_t script_len = READ_HEAD_BUF->num_lines;
  uint8_t delay_sec = READ_HEAD_BUF->delay_sec;
  //Serial.print("Got header and will malloc read buffer with # lines: ");
  Serial.println(script_len);
  //Serial.print("Header dictates playback delay of seconds: ");
  Serial.println(delay_sec);
  realloc_read_buf(READ_BUF, script_len);
  unsigned long temp_buf;
  
  /* Read payload */
  bool done = false;
  uint8_t curr_line = 0;
  unsigned long read_payload_start_time = millis();
  while (!done)
  {
    if (millis() - read_payload_start_time < TIMEOUT)
    {
      if (!radio.available())
      {
        continue; 
      }
      radio.read(&READ_BUF[curr_line], sizeof(blinkm_script_line));
      //Serial.print("Got line with dur: ");
      Serial.println(READ_BUF[curr_line].dur, DEC);
      curr_line++;
      if (curr_line >= script_len) {
        done = true;
      }
    }
    else
    {
      Serial.print("Timeout during reading payload.\n");
      Serial.print("\r\ncmd>");
      return;
    }
  }
  
  // Play script TODO: make function
  delay(delay_sec * 1000);
  BlinkM_writeScript( blinkm_addr, 0, script_len, 0, READ_BUF);
  BlinkM_playScript( blinkm_addr, 0,1,0 );
  Serial.print("\r\ncmd>");
}

void send(blinkm_script_line *script_lines, uint8_t script_len,
          uint8_t delay_sec)
{
  Serial.println("Setting this node as transmitter...");
  role = role_ping_out;
  radio.stopListening();
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1,pipes[1]);
  Serial.println("done.");

  /* Send header */
  lightscript_header header;
  header.num_lines = script_len;
  header.delay_sec = delay_sec;
  //Serial.print("Sending header--script len is: ");
  Serial.println(header.num_lines);
  //Serial.print("Sending with delay: ");
  Serial.println(header.delay_sec);
  bool ok = radio.write(&header, sizeof(lightscript_header));
  if (ok)
    Serial.println("Send ok... ");
  else
    Serial.println("Send failed.");

  //delay(500);
  /* Send main script */
  //Serial.println("Now sending: ");
  unsigned long send_line_start_time = millis();
  for (int i = 0; i < script_len; i++)
  {
    //delay(200);
    if (millis() - send_line_start_time >= TIMEOUT)
    {
      Serial.println("Error: timeout during sending lines.");
      goto SetReceiver;
    }
    ok = radio.write(&script_lines[i], sizeof(blinkm_script_line));
    if (ok)
      //Serial.println("Send line ok... ");
      ;
    else {
      //Serial.println("Send line failed. Trying again...");
      i--;
    }
  }
  
  SetReceiver:
    Serial.println("Setting back as receiver");
    role = role_pong_back;
    radio.openWritingPipe(pipes[1]);
    radio.openReadingPipe(1,pipes[0]);
    radio.startListening();
    Serial.print("done.");
}
