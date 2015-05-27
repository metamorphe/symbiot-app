import threading
import sys
import getch
import controller as controller

class KeyEventThread(threading.Thread):
    def __init__(self, ard):
        super(KeyEventThread, self).__init__()
        self.controller = ard
        self.char_buffer = []

    def run(self):
        print "> ",
        while True:
            c = getch.getch()
            # escape key to exit
            if ord(c) == ord('\n'):
                sys.stdout.write('\n')
                self._handle_line()
            elif ord(c) == ord('\b'):
                self.char_buffer.pop(len(self.char_buffer) - 1)
                sys.stdout.write(c)
            elif ord(c) == ord('q'):
                print "\nBye!"
                break;
            else:
                self.char_buffer.append(c)
                sys.stdout.write(c)

    def _handle_line(self):
        if len(self.char_buffer):
            c = self.char_buffer[0]
            if ord(c) == ord('o'):
                print "Opened serial connection:"
                self.controller.open();
            elif ord(c) == ord('s'):
                address, value = self._parse_send_cmd(self.char_buffer)
                print "Actuating ", address, " to ", value
                self.controller.actuate(address, value)
            elif ord(c) == ord('c'):
                print "Closed serial connection"
                self.controller.close();
            else:
                print "Unknown command"
        self.char_buffer = []
        print "> ",

    def _parse_send_cmd(self, buffer):
        """
        Destructively parses BUFFER, which should be in the form:

        ['s', <address chars>, ',', <value chars>]

        and returns (address, value) as ints. If BUFFER is not a well-formed,
        returns (0, 0)
        """
        buffer.pop(0)
        address_buffer = []
        while (ord(buffer[0]) != ord(',')):
            address_buffer.append(buffer[0])
            buffer.pop(0)
        buffer.pop(0)
        try:
            address = int(''.join(address_buffer))
            value = int(''.join(buffer))
        except ValueError:
            address, value = 0, 0
        return (address, value)

ard = controller.ArduinoSerialConnection();
ard.close();

kethread = KeyEventThread(ard)
kethread.start()