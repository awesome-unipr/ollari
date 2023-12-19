[![Node.js CI](https://github.com/awesome-unipr/ollari/actions/workflows/main.yaml/badge.svg)](https://github.com/awesome-unipr/ollari/actions/workflows/main.yaml)

# remote-keyless-system

## Requirements

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

## Testing

### mqtt server

Server mqtt installato per mac con homebrew con `brew install mosquitto` e avviato con:

```bash
mosquitto
```

### mqttx-cli

Ascolto del topic per sviluppo locale:

```bash
mqttx sub -t 'vc2324/key-is-ok' -h 'localhost' -p 1883
```

## Utilizzo

```bash
cp .env.sample .env # modificare le variabili
npm install
npm run build
./vc
```

## Interfacce

### Aggiunta utente

```json
{
  "id": "ID_UNIVOCO_DA_ASSEGNARE",
  "token": "PASSWORD"
}
```

Che nel caso di ID non univoco ritorna:

```json
{
  "message": "Driver already exists"
}
```

### Sblocco

```json
{
  "id": "ID_UTENTE",
  "token": "password"
}
```

Che ritorna:

```json
{
  "message": "Success"
}
```

Oppure:

```json
{
  "message": "Invalid token"
}
```

### Get last driver

Richiesta **GET** a `localhost:8888/driver` che ritorna se non sono stati effettuati
accessi al veicolo:

```json
{
  "message": "No drivers found"
}
```

Oppure l'ultimo utente (id e hash del token):

```json
{
  "id": "1",
  "token": "$argon2id$v=19$m=65536,t=2,p=1$Vyw45iCGw5+kOFDm9M9kVQH7m8zhgWwf9ebDGlt4PwA$/E8+HHpW25O/wrw70t8nfg49auI3KzGdHrvhUSan5JQ"
}
```
