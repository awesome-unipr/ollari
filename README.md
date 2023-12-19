# remote-keyless-system

Last (but not least), as anticipated, the vehicle is provided with a keyless
system enabling the vehicle to start or to be stopped, given the presence of
the right keycard in the neighborhood of the vehicle itself. Thus, a proper
KeylessOBU should be in charge of handling this functionality, in detail
supporting the fol- lowing HTTP requests:

• POST (from an external HTTP client) on the /keyless HTTP endpoint, accepting
a string containing the identity of the driver and a pseudo- random sequence to
be recognized by the vehicle;

• GET (from an external HTTP client) on the /driver HTTP endpoint, returning
the identity of the last driver opening the car, or the indication that someone
(unrecognized) tried to open the vehicle.

Then, each time that a known driver is recognized by the proper OBU, the
KeylessOBU should notify all the other OBUs publishing a proper message on the
MQTT topic denoted as vc2324/key-is-ok
