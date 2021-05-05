import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { TaskList } from './pages/TaskList';


export class Tamagotchi extends React.Component {

  constructor(name)
  {
    this.name = name;
    this.foodLevel = 100;
    this.sleepLevel = 100;
    this.playLevel = 100;
  }

  hungerDrain()
  {
    setInterval(() =>
    {this.foodLevel-=5;
    }, 1000);
  }

  sleepDrain()
  {
    setInterval(() =>
    {this.sleepLevel-=2;
    }, 1000);
  }

  playDrain()
  {
    setInterval(() =>
    {this.playLevel-=3;
    }, 1000);
  }

  feed() {
    this.foodLevel += 20;
  }

  sleep() {
    this.sleepLevel += 10;
  }

  play() {
    this.playLevel += 10;
  }


  didTamagatchiDie()
  {
    if(this.foodLevel === 0 && this.sleepLevel === 0 && this.playLevel === 0)
    {
      return true;
    }
    else return false;
  }

  render() {
    console.log('render');
    return (
        <div>
            наш компонент
            
        </div>
    )
  }


}

export default Tamagotchi;