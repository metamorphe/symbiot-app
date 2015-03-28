Project Members
---
Cesar Torres <cearto@berkeley.edu>
Tim Campbell <timcam@berkeley.edu>
Jasper O'Leary <j.oleary@berkeley.edu>
Akhila Raju <akhilaraju@berkeley.edu>
Kenny Wang <kennyw1019@gmail.com>


Project Skeleton & Dependencies
---
https://github.com/WeAreLeka/Bare-Arduino-Project


Running Code
---
Update Makefile
make 
make upload


Viewing Serial Output
--- 
You can view serial output from an arduino using the screen UNIX command. 

ScriptEditor Application 
*************************
tell application "Terminal"
	do script with command "screen /dev/tty.usbmodem1451 115200"
	set number of rows of window 1 to 100
	set number of columns of window 1 to 80
	set background color of window 1 to "white"
	set normal text color of window 1 to "black"
	set custom title of window 1 to "SerialOut"
end tell