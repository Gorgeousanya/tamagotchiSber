import React from "react";
import logo1 from '../src/1.gif';
import logo2 from '../src/22.gif';
import logo3 from '../src/12.gif';
import logo4 from '../src/44.gif';
import logo5 from '../src/38.gif'
import { createGlobalStyle } from 'styled-components';
import { Container, Row, Col, Filler, Badge } from '@sberdevices/plasma-ui/components/Grid';
import { Button } from '@sberdevices/plasma-ui';
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import "./App.css";
import {Tamagotchi} from './Tamagotchi.js';



const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};


export class App extends React.Component {
  

  constructor(props) {
    super(props);
    console.log('constructor');
    
    this.state = {
      notes: [],
      logo: logo1,
      foodLevel: 100,
      sleepLevel: 100,
      playLevel: 100,
    }
    this.Change_img = this.Change_img.bind(this);

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
    
    this.prepareTamagotchiCreation = this.prepareTamagotchiCreation.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    setInterval(() =>
    {this.setState({ foodLevel: this.state.foodLevel=-5, sleepLevel: this.state.sleepLevel=-3, playLevel: this.state.playLevel=-4 }); this.didTamagatchiDie();
    }, 1000);
  }
  hungerDrain()
  {
    setInterval(() =>
    {this.foodLevel-=5; this.didTamagatchiDie();
    }, 1000);
  }

  sleepDrain()
  {
    setInterval(() =>
    {this.sleepLevel-=2; this.didTamagatchiDie();
    }, 1000);
  }

  playDrain()
  {
    setInterval(() =>
    {this.playLevel-=3; this.didTamagatchiDie();
    }, 1000);
  }

  feed() {
    this.foodLevel = 100;
    
  }

  sleep() {
    this.sleepLevel = 100;
  }

  play() {
    this.playLevel = 100;
  }


  didTamagatchiDie()
  {
    if(this.foodLevel === 0 && this.sleepLevel === 0 && this.playLevel === 0)
    {
      this.setState({ logo:  logo5});
      return true;
    }
    else return false;
  }


  prepareTamagotchiCreation(event) {
    event.preventDefault()
    const { _name } = this.refs;
    var newTamagotchi = new Tamagotchi(_name.value);
    this.props.addNewCreatureToTamagotchi(newTamagotchi);
    this.props.hideFormAfterSubmission();
    console.log(newTamagotchi.name);
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.notes.map(
          ({ id, title }, index) => ({
            number: index + 1,
            id,
            title,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'add_note':
          return this.Change_img(1);

        case 'done_note':
          return this.Change_img(2);

        case 'delete_note':
          return this.Change_img(3);

        default:
          throw new Error();
      }
    }
  }

  add_note (action) {
    console.log('add_note', action);
    this.setState({
      notes: [
        ...this.state.notes,
        {
          id:        Math.random().toString(36).substring(7),
          title:     action.note,
          completed: false,
        },
      ],
    })
  }

  done_note (action) {
    console.log('done_note', action);
    this.setState({
      notes: this.state.notes.map((note) =>
        (note.id === action.id)
        ? { ...note, completed: !note.completed }
        : note
      ),
    })
  }

  delete_note (action) {
    console.log('delete_note', action);
    this.setState({
      notes: this.state.notes.filter(({ id }) => id !== action.id),
    })
  }

  Change_img(value){
    switch (value) {
      case 1:
        this.setState({ logo:  logo2});
        setTimeout(() => {this.setState({ logo:  logo1}); }, 4000);
        this.feed();
        //Здесь выполняются инструкции, если результат выражения равен value1
        break;
      case 2:
        this.setState({ logo:  logo3});
        setTimeout(() => {this.setState({ logo:  logo1}); }, 5000);
        this.play();
        //Инструкции, соответствующие value2
        break;
      case 3:
        this.setState({ logo:  logo4});
        setTimeout(() => {this.setState({ logo:  logo1}); }, 100000);
        this.sleep();
        break;
      default:
        this.setState({ logo:  logo1});
        break;
    }

  }

  render() {
    console.log('render');
    
    const f = this.state.foodLevel*4;
    const p = this.state.playLevel*4;
    const s = this.state.sleepLevel*4;
    return (
      <div >
        
        <h1 > Sbercat </h1>

        
        <img id = "img" src={this.state.logo} class="rounded mx-auto d-block"  style={{width: 400, height:400 }}/>
        
        <div class="rounded" style={{
        position: 'absolute',
        width: f+'px', // `${v}px`
        left: '400px',
        top: '100px',
        height: '35px',
        backgroundColor: 'green',
        }}> </div>
        <h1 style={{
        position: 'absolute',
        left: '850px',
        top: '77px',
        }}> Сытость </h1>
        <div class="rounded" style={{
        position: 'absolute',
        width: p+'px', // `${v}px`
        left: '400px',
        top: '200px',
        height: '35px',
        backgroundColor: 'green',
        }}> </div>
        <h1 style={{
        position: 'absolute',
        left: '850px',
        top: '177px',
        }}> Счастье </h1>
        <div class="rounded" style={{
        position: 'absolute',
        width: s+'px', // `${v}px`
        left: '400px',
        top: '300px',
        height: '35px',
        backgroundColor: 'green',
        }}> </div>
        <h1 style={{
        position: 'absolute',
        left: '850px',
        top: '277px',
        }}> Бодрость </h1>


        <Button
        text='Покормить!'
        size='l'
        view='primary'
        pin="square-square"
        onClick={()=>this.Change_img(1)}

        />
        <Button
        text='Поиграть!'
        size='l'
        view='primary'
        pin="square-square"
        onClick={()=>this.Change_img(2)}/>
        <Button
        text='Поспать!'
        size='l'
        view='primary'
        pin="square-square"
        onClick={()=>this.Change_img(3)}/>
      </div>
      // <TaskList
      //   items  = {this.state.notes}
      //   onAdd  = {(note) => { this.add_note({ type: "add_note", note }); }}
      //   onDone = {(note) => { this.done_note({ type: "done_note", id: note.id }) }}
      // />
      
    )
  }
}

