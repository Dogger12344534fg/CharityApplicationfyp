import React,{useState} from "react";

function MyComponent(){
  const [name, setName]= useState("");
 


  function coToset(event){
    setName(event.target.value);
  }

return (
  <div>

    <input type="text" value={name} onChange={coToset}>
    </input>
    <p>Name:{name}</p>

{/* 

    <label>
    <input type ="radio" value="dipu" checked = {name==="dipu"} onChange={coToset}/>Dipu</label>
    
    <lable> <input type ="radio" value="Khami" checked = {name==="Khami"} onChange={coToset}/>Khami</lable> 
    <p>
      Limitetaiom :{name}</p>  */}
  </div>
);
}

export default MyComponent