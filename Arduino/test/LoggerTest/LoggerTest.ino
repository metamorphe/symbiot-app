#include "ArduinoUnit.h"
#include "Logger.h"
#include "Behavior.h"
// assertLess(arg1,arg2)
// assertLessOrEqual(arg1,arg2)
// assertEqual(arg1,arg2)
// assertNotEqual(arg1,arg2)
// assertMoreOrEqual(arg1,arg2)
// assertMore(arg1,arg2)
// Testing timestamped logging suite

// Create test suite
// TestSuite suite;
Logger *logger;

void setup() {
 
  Serial.begin(9600);
}

test(init){
	logger = new Logger(100, 0, 1024);
	assertEqual(logger->pos, 0);
}

// HANDLE SIZE INITS GREATER THAN A MAX
// HANDLE NEGATIVE SIZE INITS
// HANDLE CALLOC ERRORS, GRACEFULLY

void logsample(){
	logger = new Logger(100, 0, 1024);
	logger->log(0);
	delay(500);
	logger->log(20);
	delay(500);
	logger->log(100);
	delay(500);
	logger->log(200);
	delay(500);
	logger->log(1024);
	logger->print();
	logger->printIR();
}

test(logging){
	logsample();
	assertEqual(logger->length(), 5);
	// ACCURATE STORAGE
	assertEqual(logger->get(0)->value, 0); 
	assertEqual(logger->get(1)->value, 20); 
	assertEqual(logger->get(2)->value, 100); 
	assertEqual(logger->get(3)->value, 200); 
	assertEqual(logger->get(4)->value, 1024);

	// ACCURATE DIFFS
	assertEqual(logger->getIR(0).next, 20); 
	assertEqual(logger->getIR(1).next, 100); 
	assertEqual(logger->getIR(2).next, 200); 
	assertEqual(logger->getIR(3).next, 1024); 
	assertEqual(logger->getIR(4).next, 0);


	// QUEUE REFERENCES
	assertEqual(logger->first()->value, 0);
	assertEqual(logger->last()->value, 1024);

	// TIME HAS ELAPSED
	assertNotEqual((logger->last()->timestamp - logger->first()->timestamp), 0);
	// RELATION HAPPENS_BEFORE IS HELD
}
test(behavior_log){
	getLog();
	alternate_on_and_dim->print();
	assertEqual(alternate_on_and_dim->length(), 6);
	alternate_on_and_dim->printIR();
}
// HANDLE LOG 10 VALUES, PRINT 10 VALUES, EQUIV DELAYS
// HANDLE LOG 10 VALUES, PRINT 10 VALUES, NON_EQUIV DELAYS

// SET/GET MINMAX CAP
// VALUES ARE CAPPED, EXTREME EDGES

// STATE LOGGING (WHEN TRUE, WHEN FALSE)


/* QUERY INTERFACE */
// Callback queue linked list (Send command with ptr to next command to queue)
test(clear_logging){

}

void loop() {
  Test::run();
}