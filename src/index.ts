import "reflect-metadata";

import express from "express";

import { Connection, createConnection, Repository } from "typeorm";
import { Account } from "./entity/Account.entity";
import TTS from "./tts";
import STT from "./stt";

import fs from "fs";

const app = express();
const port = Number(process.env.PORT || 80);

app.use(express.json())


let connection: Connection = null;
let accountRepo: Repository<Account> = null;

app.get('/tts/:text/audio.mp3', async (req, res) => {
  const text = String(req.params.text);

  await TTS(text);

  res.setHeader('content-type', 'audio/mp3');
  res.setHeader("accept-ranges", "bytes");

  res.status(200);

  fs.exists('output.mp3',function(exists){
		if(exists)
		{
			const rstream = fs.createReadStream('output.mp3');
			rstream.pipe(res);
		}
		else
		{
			res.end("Its a 404");
		}
	});
});

app.post('/stt', async (req, res) => {
  // Must be in Base64
  console.log(req.body);
  const audioBytes = req.body.data;

  console.log(audioBytes);

  const data = await STT(audioBytes);

  res.status(200).json(data);
})

app.post('/person-exists', async (req, res) => {
  const data = await accountRepo.findOne({ username: req.body.username });

  res.json({
    exists: Boolean(data)
  });
});

app.post('/get-person', async (req, res) => {
  console.log(req.body);

  const data = await accountRepo.findOne({ username: req.body.username });

  if (data) {
    if (req.body.password === data.password) {
      res.json({
        ...data
      });
    } else {
      res.status(403).json({
        error: "Wrong password."
      });
    }
  } else {
    res.status(403).json({
      error: "No such user."
    });
  }
});

app.post('/add-person', async (req, res) => {
  console.log(req.body);

  const data = await accountRepo.findOne({ username: req.body.username });

  if (data) {
    res.status(400).json({
      error: "User already exists."
    });
  } else {
    const newAcc = new Account();

    newAcc.username = req.body.username;
    newAcc.password = req.body.password;
    newAcc.progress = 0;

    accountRepo.save(newAcc);

    res.status(200).json({ status: 200 });
  }
});

app.post('/set-progress', async (req, res) => {
  const data = await accountRepo.findOne({ username: req.body.username });

  if (data) {
    data.progress = req.body.progress;

    await accountRepo.save(data);

    res.status(200).json({
      status: 200
    });
  } else {
    res.status(403).json({
      error: "No such user."
    });
  }
});

(async () => {
  console.log(process.env);
  connection = await createConnection();
  accountRepo = connection.getRepository(Account);

  const allAccounts = await accountRepo.find();


  // tslint:disable-next-line:no-console
  console.log(allAccounts)

  app.listen(port, "0.0.0.0", () => {
    // tslint:disable-next-line:no-console
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();