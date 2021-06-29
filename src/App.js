import './App.css';
import {bankOne, bankTwo} from './audio'
import React from 'react'
bankOne.name = "Heater Kit"
bankTwo.name = "Smooth Piano Kit"

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currKey: 0,
      powerOn: true,
      volumn: 50,
      text: " ",
      bankSet: bankOne,
      keyCode: ""
    }
  }

  update = (idx) => {
    this.setState({
      currKey: idx,
      text: this.state.bankSet[idx].id.replace('-', ' ')
    })
  }

  togglePowerOn = () => {
    this.setState((prevState) => {
      return {powerOn: !prevState.powerOn}
    })
  }

  setDisplay = (text) => {
    this.setState({
      text
    })
  }

  changeVolumn = (e) => {
    this.setState({
      volumn: e.target.value
    })
    this.setDisplay(`volumn: ${e.target.value}`)

    setTimeout(() => this.setDisplay(" "), 200)
  }

  toggleBankSet = () => {
    if (!this.state.powerOn)
      return
    this.setState((prevState) => {
      let prev = prevState.bankSet
      let curr = prev == bankOne? bankTwo:bankOne
      return {
        bankSet: curr,
        text: curr.name
      }
    })
  }

  render () {
    let audios = [].slice.call(document.getElementsByClassName('clip'))
    audios.forEach((audio) => {
      audio.volume = parseFloat(this.state.volumn) / 100
    })
    return (
      <div className="App" id="drum-machine">
        <DrumPadList update={this.update} powerOn={this.state.powerOn} bankSet={this.state.bankSet} onClick={this.onClickPad} />
        <div className="control-pannel">
          <Power onClick={this.togglePowerOn} powerOn={this.state.powerOn}/>
          <Display powerOn={this.state.powerOn} text={this.state.text} />
          <SlideBar onChange={this.changeVolumn} value={this.state.volumn} />
          <Bank onClick={this.toggleBankSet} powerOn={this.state.powerOn} bankSet={this.state.bankSet}/>
        </div>
      </div>
    )
  }

}

function DrumPadList(props){
  return (
    <div className="drum-pad-wrapper">
      {
        props.bankSet.map((item, idx) => {
          return <DrumPad update={props.update} powerOn={props.powerOn} item={item} idx={idx} onClick={props.onClick} />
        })
      }
    </div>
  )
}

class DrumPad extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      backgroundColor: "antiquewhite"
    }
  }

  componentDidMount () {
    document.addEventListener('keypress', this.onKeyPress)
  }

  componentWillUnmount () {
    document.removeEventListener('keypress', this.onKeyPress)
  }

  onClick = (idx) => {

    if (!this.props.powerOn)
      return

    this.setStyle()

    this.props.update(idx) // update parent state

    let audio = document.getElementById(`pad-${idx}`).getElementsByClassName('clip')[0]
    audio.play()

  }

  onKeyPress = (e) => {
    if (e.key == this.props.item.keyTrigger.toLocaleLowerCase()) {
      this.onClick(this.props.idx)
    }
  }

  setStyle = () => {
    this.setState({
      backgroundColor: "yellow"
    })

    setTimeout(() => {
      this.setState({
        backgroundColor: 'antiquewhite'
      })
    }, 200)
  }


  render(){
    let item = this.props.item
    return (
      <button key={this.props.idx} style={this.state} className="drum-pad" id={`pad-${this.props.idx}`} onClick={()=>this.onClick(this.props.idx)}>
        {item.keyTrigger}
        <audio preload="auto" src={item.url} className="clip" id={item.keyTrigger}/>
      </button>
    )
  }
}

function Toggle(props){
  return (
    <div className="parent" onClick={props.onClick}>
      <div className="block" style={props.style}></div>
    </div>
  )
}

function Power(props){
  let style = {float: props.powerOn? 'left': 'right'}
  return (
    <div id="power">
      <span>POWER</span>
      <Toggle onClick={props.onClick} powerOn={props.powerOn}  style={style}/>
    </div>
  )
}

function Display(props){
  return (
    <div className="display-wrapper">
      <span id="display">{props.powerOn? props.text: " "}</span>
    </div>
  )
}

function SlideBar(props){
  return (
    <div>
      <div id="slide-bar">
        <input type="range" min="0" max="100" step="0.1" onChange={props.onChange} value={props.volumn}/>
      </div>
    </div>
  )
}

function Bank(props){
  let style = {float: props.bankSet == bankOne? 'left': 'right'}
  return (
    <div id="bank">
      <span>BANK</span>
      <Toggle onClick={props.onClick} style={style} />
    </div>
  )
}



export default App;
