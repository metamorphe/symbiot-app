#include "ArduinoUnit.h"
#include <SD.h>
#include "SDLogger.h"
#include "Logger.h"
#include "Behavior.h"
#include "Actuator.h"
// assertLess(arg1,arg2)
// assertLessOrEqual(arg1,arg2)
// assertEqual(arg1,arg2)
// assertNotEqual(arg1,arg2)
// assertMoreOrEqual(arg1,arg2)
// assertMore(arg1,arg2)
// Testing timestamped logging suite

// Create test suite
// TestSuite suite;
#define LED_PIN 9
#define MIN 1
#define MAX 0

Logger *logger;
Actuator *led;
Actuator *led2;

void setup() {
  Serial.begin(9600);
}

test(init){
	led = new Actuator("led", LED_PIN, 0, 255);
	assertEqual(led->bound(MIN), 0);
	assertEqual(led->bound(MAX), 255);
}
// test(turn_on){
// 	led = new Actuator(LED_PIN, 0, 255);
// 	led->actuate(1000, 1000);
// }

// test(turn_off){
// 	led = new Actuator(LED_PIN, 0, 255);
// 	led->actuate(0, 1000);
// }

// test(turn_progression){
// 	led = new Actuator(LED_PIN, 0, 255);

// 	led->actuate(0, 1000);
// 	led->actuate(100, 1000);
// 	led->actuate(0, 3000);
// 	led->actuate(1000, 1000);
// 	led->actuate(0, 1000);
// 	led->actuate(500, 1000);
// 	led->actuate(0, 1000);
// 	led->actuate(0, 1000);
// 	led->actuate(1000, 1000);
// }
test(storage){
	logger = new Logger(100, 0, 1000);
		logger->log(255); delay(1000);	
		logger->log(0); delay(1000);
		logger->log(255); delay(1000);
		logger->log(0); delay(1000);
		logger->log(255); delay(1000);
	logger->print();


	assertEqual(logger->get(0)->value, 255); 
	assertEqual(logger->get(1)->value, 0); 
	assertEqual(logger->get(2)->value, 255); 
	assertEqual(logger->get(3)->value, 0); 
	assertEqual(logger->get(4)->value, 255);


	led = new Actuator("led", LED_PIN, 0, 255);
	led->set(logger);

	assertEqual(led->length(), 5);

	unsigned long t0 = micros();
	Serial.print("Start time: ");
	Serial.println(t0);
	led->playable(true);
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);

	logger->printIR();
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);
	// led->next(t0);

}

test(blink_increasing){
	led = new Actuator("led1", LED_PIN + 1, 0, 255);
	led2 = new Actuator("led2", LED_PIN, 0, 255);
	getLog();
	blink_increasing->print();
	assertEqual(blink_increasing->length(), 11);
	
	// Serial.println(alternate_on_and_dim->get(0)->timestamp);
	// Serial.println(alternate_on_and_dim->get(1)->timestamp);
	// Serial.println(alternate_on_and_dim->getIR(0).delay);
	// assertEqual(alternate_on_and_dim->getIR(0).delay, 200);
	
	blink_increasing->printIR();
	
	led2->set(blink_increasing);
	led->set(blink_increasing);

	unsigned long t0 = micros();
	Serial.print("Start time: ");
	Serial.println(t0);
	led->playable(true);
	led2->playable(true);
	
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	led->next(t0);
	led2->next(t0);
	
}

void loop() {
  Test::run();
}