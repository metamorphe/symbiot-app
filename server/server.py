from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from SocketServer import ThreadingMixIn
import threading
import argparse
import re
import cgi
import json
import controller as controller

class LocalData(object):
    last_id = 0
    records = {}
    arduino = controller.ArduinoSerialConnection()

class HTTPRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        if re.search('/devices', self.path):
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            print "ctype is: ", ctype
            if ctype == 'application/json':
                LocalData.records[LocalData.last_id] = 0
                print "Device with ID: %s added successfully" % LocalData.last_id
                LocalData.last_id += 1
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

    def do_GET(self):
        if re.search('/devices/\d', self.path):
            recordID = self.path.split('/')[-1]
            if LocalData.records.has_key(recordID):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(LocalData.records[recordID])
            else:
                self.send_response(400, 'Bad Request: record does not exist in ' + str(LocalData.records))
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
        elif re.search('/devices', self.path):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(LocalData.records))
        else:
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

    def do_PUT(self):
        if re.search('/devices/\d/\d', self.path):
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            print "ctype is: ", ctype
            if ctype == 'application/json':
                recordID = int(self.path.split('/')[-2])
                value = int(self.path.split('/')[-1])
                print "Got PUT request with id: %d and value: %d" % (recordID, value)
                try:
                    # send_state(recordID, value)
                    LocalData.arduino.actuate(recordID, value)
                    LocalData.records[recordID] = value
                    print "Value is: %s" % value
                except KeyError:
                    print "Error: no record with id: %d" % recordID

    def do_DELETE(self):
        print 'DELETE: not yet implemented'

class HandlerUtil(object):

    def make_device_list(records):
        """
        Takes a dictionary RECORDS whose entries have the form:

        "<ID>" : 
        """
        pass

    def send_state(id, value):
        """
        Builds a command of the form:

        s<ID>,<VALUE>

        To send to serial. TODO: return boolean confirmation
        """
        pass

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    allow_reuse_address = True

    def shutdown(self):
        self.socket.close()
        HTTPServer.shutdown(self)

class SimpleHttpServer():
    def __init__(self, ip, port):
        self.server = ThreadedHTTPServer((ip,port), HTTPRequestHandler)

    def start(self):
        self.server_thread = threading.Thread(target=self.server.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()

    def waitForThread(self):
        self.server_thread.join()

    def addRecord(self, recordID, jsonEncodedRecord):
        LocalData.records[recordID] = jsonEncodedRecord

    def stop(self):
        self.server.shutdown()
        self.waitForThread()

if __name__=='__main__':
    parser = argparse.ArgumentParser(description='HTTP Server')
    parser.add_argument('port', type=int, help='Listening port for HTTP Server')
    parser.add_argument('ip', help='HTTP Server IP')
    args = parser.parse_args()

    server = SimpleHttpServer(args.ip, args.port)
    print 'HTTP Server Running...........'
    server.start()
    server.waitForThread()
