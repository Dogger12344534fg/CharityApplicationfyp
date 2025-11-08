import React,{useState} from 'react'


function Color(){
const[color, changColor] = useState("#FFFFF");

function onChangerr(event){
  changColor(event.target.value);
}
return (<div className='color-changer'>

  <h1>Hello color</h1>
  <div className='color' style={{backgroundColor:color}}>
    <p>Colorname:{color}</p>
  </div>

  <p className='gapp'>Select color</p>
  <input type='color' value= {color} onChange={onChangerr}/>
</div>);
}

export default Color