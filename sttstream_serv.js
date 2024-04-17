import { spawn } from "child_process";
import stripAnsi from "strip-ansi";
// import Replicate from "replicate";
import dotenv from "dotenv";
// import download from 'download'
import path from "path";
import {WebSocketServer} from 'ws';
import fs from "fs";
import { platform } from 'node:process';


dotenv.config();

//todo: mkdir if not exist
const outputDirectory = "./output";

process.stdout.setEncoding('utf8');
process.stderr.setEncoding('utf8');
let frameNumber = 0;

// clean up output dir
fs.readdir(outputDirectory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(outputDirectory, file), (err) => {
      if (err) throw err;
    });
  }
});

// sockets for clients
let sockets = [];
async function generatePrompt(speechData) {
  const crazyWhisperPrompt = stripAnsi(speechData)
    .replace(/[\r\n]+/g, " ")
    .replace(/\[.*?\]/g, "")
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence, index, self) => self.indexOf(sentence) === index)
    .join(". ")
    .trim();

  if (crazyWhisperPrompt.toLowerCase().includes("humans")) {
    HUMANS = true;
    console.log("HUMANS HAS BEEN SAID!");
  } else if (crazyWhisperPrompt.toLowerCase().includes("void")) {
    HUMANS = false;
    frameNumber = 0;
  }

  if (!crazyWhisperPrompt.length) {
    console.log("no prompt yet!");
  } else {
    console.log('sending prompt:' + crazyWhisperPrompt)
    //tell every client the prompt
    sockets.forEach( (s) => {
      s.send(crazyWhisperPrompt)
    });
  }
}

// construct a cross platform command
function constructWhisperStreamCommand() {
  const whpath='./whisper.cpp';
  const modelpath=`${whpath}/models`;
  let longCommand=`${whpath}/stream -m ${modelpath}/ggml-base.en.bin -t 8 --step 500 --length 5000`;
  if (process.platform === "win32" ) {
    longCommand= path.win32.normalize(longCommand);
  }
  console.log('command =', longCommand);
  const cmdparts = longCommand.split(/\s+/);
  return {
        maincmd: cmdparts[0],
        args: cmdparts.slice(1)
  }
}

// Whisper.cpp stuff
const {maincmd, args} = constructWhisperStreamCommand()
const listen = spawn( maincmd, args, { shell: true });


listen.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

listen.stdout.on("data", async (chunk) => {
  generatePrompt(String(chunk));
});

listen.stdout.on("end", () => {});

// websocket server stuff
const server = new WebSocketServer({
  port: 8081
});

server.on('connection', function(socket) {
  sockets.push(socket);
  // receive a command
  socket.on('message', function(cmd) {
    sockets.forEach( (s) => {
      //todo: implement the command handler
      //s.send(msg)
    });
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});
