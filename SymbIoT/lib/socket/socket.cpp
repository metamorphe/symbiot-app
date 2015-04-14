#include "socket.h"

#define TIMEOUT 3000

/* rF configuration */
// RF24 radio(9,10); // Uncomment this if using default pin setup
RF24 radio(A0, 10); // Uncomment this if using PCB board
RF24Network network(radio);

blinkm_script_line buffer[16];
RF24NetworkHeader header;
RF24NetworkHeader *most_recent_header;
uint8_t num_lines;
static uint8_t current_line_num;
uint16_t address_buffer;

/* Functions for behavior transmission. */
static void send_alloc_message (uint16_t, uint16_t, uint8_t);
static void send_line_message (uint16_t, uint16_t, blinkm_script_line *);
static void send_end_message (uint16_t, uint16_t);

static inline void handle_alloc_message (void);
static inline void handle_line_message (void);
static inline void handle_end_message (void);

/* Functions for service discovery. */
static void send_discovery_message (uint16_t, uint16_t);
static void send_acknowledge_message (uint16_t, uint16_t);

static inline void handle_discovery_message (void);
static inline void handle_acknowledge_message (void);

/* Hard coding fun! */
void send_on_message (uint16_t, uint16_t);
void send_off_message (uint16_t, uint16_t);

void handle_on_message (void);
void handle_off_message (void);

static inline void handle_unknown_message (void);

int
setup_radio (uint16_t node_addr)
{
  radio.begin ();
  radio.setRetries (15,15);
  network.begin (90, node_addr);
  return 1;
}

int
receive()
{
  network.update();
  if (!network.available ())
    return 0;

  network.peek(header);
  // printf_P (PSTR ("%lu: APP Received message of type %c from % "PRIu16 "\n\r"),
  //                   millis (), header.type, header.from_node);
  *most_recent_header = header;
  switch (header.type)
  {
    case 'N':
      handle_on_message ();
      break;
    case 'F':
      handle_off_message ();
      break;
    case 'A':
      handle_alloc_message ();
      break;
    case 'L':
      handle_line_message ();
      break;
    case 'E':
      handle_end_message ();
      break;
    case 'C':
      handle_acknowledge_message ();
      break;
    case 'D':
      handle_discovery_message ();
      break;
    default:
      handle_unknown_message ();
      break;
  }
  return 1;
}

void
send (uint16_t to_node, uint16_t from_node, blinkm_script_line *src,
      uint8_t num_lines)
{
  // printf_P(PSTR("%lu: APP Begin message from %" PRIu16 " to %" PRIu16 ".\n\r"),
  //               millis (), from_node, to_node);
  send_alloc_message (to_node, from_node, num_lines);
  for (int i = 0; i < num_lines; i++)
  {
    send_line_message (to_node, from_node, src + i);
  }
  send_end_message (to_node, from_node);
}

int
test_connection (uint16_t to_node, uint16_t from_node, unsigned long timeout)
{
  printf_P (PSTR ("%lu: APP Attempting to connect to node 0%o\r\n"),
                millis (), to_node);
  bool ok;
  unsigned long start_time = millis ();
  send_discovery_message (to_node, from_node);
  while (millis () - start_time <= timeout)
  {
    ok = receive();
    if (ok)
      return 1;
    delay (100);
  }
  printf_P (PSTR ("%lu: APP Timeout while trying to connect to node 0%o\r\n"),
                  millis (), to_node);
  return 0;
}


static void
send_alloc_message (uint16_t to_node, uint16_t from_node,
                    uint8_t num_lines)
{
  RF24NetworkHeader header(to_node, 'A');
  header.from_node = from_node;
  uint8_t _num_lines = num_lines;
  bool ok = network.write (header, &_num_lines, sizeof (_num_lines));
  // if (ok)
  //   printf_P(PSTR("%lu: APP Send alloc message ok\n\r"), millis ());
  // else
  //   printf_P(PSTR("%lu: APP Send alloc message failed\n\r"), millis ());
}

static void
send_line_message (uint16_t to_node, uint16_t from_node,
                  blinkm_script_line *line)
{
  RF24NetworkHeader header(to_node, 'L');
  header.from_node = from_node;
  bool ok = network.write (header, line, sizeof (*line));
  // if (ok)
  //   printf_P(PSTR("%lu: APP Send line message ok\n\r"), millis());
  // else
  //   printf_P(PSTR("%lu: APP Send line message failed\n\r"), millis());
}

static void
send_end_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'E');
  header.from_node = from_node;
  bool ok = network.write (header, NULL, 0);
  // if (ok)
  //   printf_P(PSTR("%lu: APP Send end message ok\n\r"), millis ());
  // else
  //   printf_P(PSTR("%lu: APP Send end message failed\n\r"), millis ());
}

static void
send_discovery_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'D');
  header.from_node = from_node;
  char buf[4] = { 'D', 'I', 'S', '\0' };
  bool ok = network.write (header, &buf, sizeof(buf));
  // if (ok)
  //   printf_P(PSTR("%lu: APP Send discovery to 0%o message ok\n\r"), millis (), to_node);
  // else
  //   printf_P(PSTR("%lu: APP Send discovery to 0%o message failed\n\r"), millis (), to_node);
}

static void
send_acknowledge_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'C');
  header.from_node = from_node;
  bool ok = network.write (header, NULL, 0);
  // if (ok)
  //   printf_P(PSTR("%lu: APP Send acknowledge message ok\n\r"), millis ());
  // else
  //   printf_P(PSTR("%lu: APP Send acknowledge message failed\n\r"), millis ());
}

static inline void
handle_alloc_message (void)
{
  network.read (header, &num_lines, sizeof (num_lines));
}

static inline void
handle_line_message (void)
{
  network.read (header, &(buffer[current_line_num++]),
                sizeof (blinkm_script_line));
}

static inline void
handle_end_message (void)
{
  current_line_num = 0;
  network.read (header, NULL, 0);
}

static inline void
handle_discovery_message (void)
{
  char buf[4];
  network.read (header, &buf, sizeof (buf));
  // printf_P (PSTR ("Discover debug: received massage %s.\r\n"), buf);
  // printf_P (PSTR ("%lu: APP Received discovery message from 0%o. Sending ACK...\r\n"),
  //                 millis (), header.from_node);
  send_acknowledge_message (header.from_node, header.to_node);
  command_self_flash_yellow ();
}

static inline void
handle_acknowledge_message (void)
{
  network.read (header, NULL, 0);
  // printf_P (PSTR ("%lu: APP Received successful acknowledge from 0%o\r\n"),
  //                 millis (), header.from_node);
}

static inline void
handle_unknown_message (void)
{
  // printf_P (PSTR ("*** WARNING *** Unknown message type %c\n\r"), header.type);
  network.read (header, 0, 0);
}

/* Hard coding fun time */

void send_on_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'N');
  header.from_node = from_node;
  bool ok = network.write (header, NULL, 0);
}

void send_off_message (uint16_t to_node, uint16_t from_node)
{
  RF24NetworkHeader header(to_node, 'F');
  header.from_node = from_node;
  bool ok = network.write (header, NULL, 0);
}

void handle_on_message (void)
{
  network.read (header, NULL, 0);
  command_self_set_on ();
}

void handle_off_message (void)
{
  network.read (header, NULL, 0);
  command_self_set_off ();
}
