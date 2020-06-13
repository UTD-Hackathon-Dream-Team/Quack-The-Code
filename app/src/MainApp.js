import React, { useState, useEffect } from "react";

import "./App.css";
import Speech from "speak-tts";
import { Link } from "react-router-dom";
import Speechy from "./Speech2text";

const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

function MainApp() {
  const [user, setUser] = useState("");
  const [commits, setCommits] = useState(0);
  const [quoteOrSetup, setQuoteOrSetup] = useState("");
  const [authorOrPunchline, setAuthorOrPunchline] = useState("");

  //Check if speech is available
  const speech = new Speech();
  if (speech.hasBrowserSupport()) {
    console.log("speech synthesis supported");
  }
  //Initalize speech with voice
  speech
    .init({
      volume: 1,
      lang: "en-US",
      rate: 1,
      pitch: 1,
      voice: "Samantha",
      splitSentences: true,
    })
    .catch((e) => {
      console.error("An error occured while initializing : ", e);
    });

  async function textToSpeech(text) {
    speech
      .speak({
        text: text,
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  }

  async function getCommits() {
    const commits = await axios.get(
      `https://api.github.com/users/${user}/events`
    );
    const push = _.filter(commits.data, { type: "PushEvent" });
    const today = _.filter(push, (obj) =>
      moment(obj.created_at).isSame(moment(), "day")
    );
    let count = 0;
    _.forEach(today, (obj) => {
      count += obj.payload.commits.length;
    });

    setCommits(count);
  }

  async function handleChange(event) {
    setUser(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await getCommits();
  }

  async function getJoke() {
    const { data } = await axios.get(
      "https://official-joke-api.appspot.com/jokes/programming/random"
    );
    setQuoteOrSetup(data[0].setup);
    await textToSpeech(data[0].setup);
    setAuthorOrPunchline(data[0].punchline);
    await textToSpeech(data[0].punchline);
  }

  async function getProgrammingQuote() {
    const { data } = await axios.get(
      "http://quotes.stormconsultancy.co.uk/random.json"
    );
    setQuoteOrSetup(data.quote);
    setAuthorOrPunchline(" - " + data.author);
    await textToSpeech(data.quote);
    await textToSpeech(data.author);
  }

  async function getQuote() {
    const { data } = await axios.get("http://api.quotable.io/random");
    setQuoteOrSetup(data.content);
    setAuthorOrPunchline(" - " + data.author);
    await textToSpeech(data.content);
    await textToSpeech(data.author);
  }

  async function getQuestion() {
    const index = Math.floor(Math.random() * PROGQUES.length);
    setQuoteOrSetup(PROGQUES[index].question);
    await textToSpeech(PROGQUES[index].question);
  }

  async function giveAdvice() {
    const { data } = await axios.get("https://api.adviceslip.com/advice");
    setQuoteOrSetup(data.slip.advice);
    setAuthorOrPunchline(" - Your code companion");
    await textToSpeech(data.slip.advice);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p> {quoteOrSetup}</p>
        <p> {authorOrPunchline}</p>
        <Speechy />
        <p> Duckie </p>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="GitHub User"
              value={user}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Get Commit" />
        </form>
        <p> {commits} Commits Today</p>
        <button onClick={getJoke}>Get a Joke</button>
        <button onClick={getProgrammingQuote}>Get a Programming Quote</button>
        <button onClick={getQuote}>Get an Inspirational Quote</button>
        <button onClick={getQuestion}>Get a Programming Question</button>
        <button onClick={giveAdvice}>Get some Advice</button>
      </header>
    </div>
  );
}

export default MainApp;

const PROGQUES = [
  {
    question:
      "What is a syntax error? A. An error due to incorrect logic. B. An error due to the language rules being broken. C. An error you will never find. D. An error caused by bad network connection.",
    answer: "B",
  },
  {
    question:
      "What is FIFO? A. First in Few Out. B. Fade in fade out. C. First in first out. D. False in fact out.",
    answer: "C",
  },
  {
    question:
      "What is a short section of code made to complete a task? A. A function. B. A buffer. C. An array. D. An variable.",
    answer: "A",
  },
  {
    question:
      "What data type holds a single letter or number? A. Word. B. Double. C. Integer. D. Character.",
    answer: "D",
  },
];
