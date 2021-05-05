import React from "react";
import logo1 from '../src/1.gif';
import logo2 from '../src/2.gif';
import logo3 from '../src/30.gif';
import logo4 from '../src/44.gif';
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
          return this.add_note(action);

        case 'done_note':
          return this.done_note(action);

        case 'delete_note':
          return this.delete_note(action);

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
    const newLogo = this.state.logo == logo1 ? logo2 : logo1;
    switch (value) {
      case 1:
        this.setState({ logo:  logo2});
        //Здесь выполняются инструкции, если результат выражения равен value1
        break;
      case 2:
        this.setState({ logo:  logo3});
        //Инструкции, соответствующие value2
        break;
      case 3:
        //Инструкции, соответствующие значению valueN
        this.setState({ logo:  logo4});
        //statementsN
        break;
      default:
        //Здесь находятся инструкции, которые выполняются при отсутствии соответствующего значения
        //statements_def
        break;
    }
    const newlogo = this.state.logo[1];

    

  }

  render() {
    console.log('render');
    
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        
        <h1> Sbercat </h1>
        
        <img id = "img" src={this.state.logo} class="rounded mx-auto d-block"  style={{width: 400, height:400 }}/>
        
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

