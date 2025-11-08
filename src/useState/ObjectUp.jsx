import React, {useState} from 'react';


function ObjectUp(){

  const [car, setCar]= useState({make:"ford",year:2024,mode:"mustang"});

  function onMake(event){
    setCar(c=>({...c, make : event.target.value}));
  }


  function onYear(event){
    setCar(c=>({...c, year : event.target.value}));
  }


  function onMode(event){
    setCar(c=>({...c, mode : event.target.value}));
  }

  return(<div>
<p>This is new to program and new car is:{car.make}, {car.year} {car.mode}</p>
<input type="text" value={car.make} onChange={onMake}/>
<input type="number" value={car.year} onChange={onYear}/>
<input type="text" value={car.mode} onChange={onMode}/>
  </div>
  );
}
export default ObjectUp