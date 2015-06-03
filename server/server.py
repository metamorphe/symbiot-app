from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from SocketServer import ThreadingMixIn
from urlparse import urlparse
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

    def do_GET(self):
        """
        Handles a GET request. Cases:

        GET /devices/ : returns the list of active nodes, each with its
                       current brightness value.

        GET /devices/<ID> : returns the current brightness value of ID.
        """
        ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
        if ctype != 'application/json':
            send_response(400, 'Bad Request: request not in JSON format.')

        # Case: return ID's brightness value
        if re.search('/devices/\d', self.path):
            recordID = int(self.path.split('/')[-1])
            if LocalData.records.has_key(recordID):
                self.send_response_with_headers(200)
                self.wfile.write(LocalData.records[recordID])
            else:
                self.send_response_with_headers(403, 'Error: record does not exist in ' + str(LocalData.records))

        # Case: list of nodes
        elif re.search('/devices', self.path):
            self.send_response_with_headers(200)
            self.wfile.write(json.dumps(LocalData.records))

        else:
            self.send_response_with_headers(400, 'Error: invalid URL.')

    def do_PUT(self):
        """
        Handles a PUT request. Cases:

        PUT /devices/<ID> : creates a node with id ID. Currently, nodes
                           are stored on the server as key-value pairs
                           with ID as a key and VALUE as a value. Note
                           that, currently PUT requests create new
                           nodes and not POST requests.

        PUT /devices/<ID>/<VALUE> : sets the brightness of the node ID
                                   to VALUE. Error if VALUE is not from
                                   0 to 100 or if ID has not yet been
                                   put in the server.

        """
        ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
        if ctype != 'application/json':
            send_response(400, 'Bad Request: request not in JSON format.')

        # Case: set VALUE to ID
        if re.search('/devices/\d/\d', self.path):
            recordID = int(self.path.split('/')[-2])
            value = int(self.path.split('/')[-1])
            print "Got PUT request with id: %d and value: %d" % (recordID, value)
            try:
                LocalData.arduino.actuate(recordID, value)
                LocalData.records[recordID] = value
                print "Value is: %s" % value
                self.send_response_with_headers(200)
            except KeyError:
                print "Error: no record with id: %d" % recordID
                self.send_response_with_headers(400, 'Error: no record with id %'                                                      % recordID)
        
        # Case: create ID
        elif re.search('/devices/\d', self.path):
            recordID = int(self.path.split('/')[-1])
            print "Got PUT request with id: %d" % recordID
            LocalData.records[recordID] = 0
            self.send_response(200)

        else:
            self.send_response_with_headers(400, 'Error: invalid URL.')

    def do_DELETE(self):
        """
        Handles a DELETE request. Cases:

        /devices/<ID> : deletes the node with ID. Error if a node with
                        ID does not exist.
        """
        # Case: delete ID
        if re.search('/devices/\d', self.path):
            recordID = int(self.path.split('/')[-1])
            try:
                LocalData.records.pop(recordID, None)
            except KeyError:
                self.send_response_with_headers(403, 'Error: record does not exist in ' + str(LocalData.records))

    def send_response_with_headers(self, code, message=None):
        """
        Utility function for sending responses from the server.
        
        Arguments:
        CODE : The HTTP response code number, e.g. 200, 404
        MESSAGE : A string representing the HTML reponse body.
        """
        self.send_response(code, message)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

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
