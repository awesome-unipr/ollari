import express, { Request, Response } from "express";
import mqtt from "mqtt";

const app = express();
app.use(express.json());

const HTTP_PORT = process.env.HTTP_PORT || 8888;
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_HOST = process.env.MQTT_HOST || "localhost";

interface Driver {
  id: string;
  token: string;
}
interface UnverifiedDriver {
  id: string;
}

const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);

client.on("connect", () => {
  console.log("connected");
  client.subscribe("vc2324/key-is-ok", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("subscribed");
    }
  });
});

const drivers: Driver[] = [];
const keylessHistory: Driver | UnverifiedDriver[] = [];

app.post("/keyless", async (req: Request, res: Response) => {
  const { id, token } = req.body;

  if (!id || !token) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (drivers.length === 0) {
    return res.status(404).json({ message: "No drivers found" });
  }

  const driver = drivers.find((driver) => driver.id === id);

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  const isTokenValid = await verifyToken(token, driver.token);

  if (!isTokenValid) {
    keylessHistory.push({ id });
    return res.status(401).json({ message: "Invalid token" });
  } else {
    keylessHistory.push(driver);
    client.publish(
      "vc2324/key-is-ok",
      `User ${id} has entered the car`,
      {},
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error publishing message" });
        } else {
          return res.status(200).json({ message: "Success" });
        }
      },
    );
  }
});
app.get("/driver", async (_req: Request, res: Response) => {
  const latestDriver = keylessHistory[keylessHistory.length - 1];

  if (!latestDriver) {
    return res.status(404).json({ message: "No drivers found" });
  }

  if (latestDriver.hasOwnProperty("token")) {
    return res.status(200).json(latestDriver);
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized", id: latestDriver.id });
  }
});

app.post("/add-key", async (req: Request, res: Response) => {
  const driver = {} as Driver;

  driver.id = req.body.id;
  driver.token = await hashToken(req.body.token);

  // check if driver already exists

  if (drivers.find((driver) => driver.id === driver.id)) {
    return res.status(409).json({ message: "Driver already exists" });
  }

  drivers.push(driver);

  res.status(201).json(driver);
});

app.get("/all", async (_req: Request, res: Response) => {
  res.status(200).json(drivers);
});

app.listen(HTTP_PORT, () => {
  console.log(`Server is listening on port ${HTTP_PORT}`);
});

const hashToken = async (token: string): Promise<string> => {
  return await Bun.password.hash(token);
};

const verifyToken = async (token: string, hash: string): Promise<boolean> => {
  return await Bun.password.verify(token, hash);
};
