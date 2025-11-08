
function Button(){


    // let count = 0;
    // const dep = (name)=> {
    //   if (count < 0){
    //     count++;
    //     console.log(`${name} you clicked me ${count}`);
    //   }else{
    //     console.log(`${name} stop clicking me ${count}`);
    //   }
    // };

    const eventhand = (e)=> e.target.textContent ="ouch";

    return(
    <button onDoubleClick={(e)=>eventhand(e)}>CLICK ME</button>
  );
}
export default Button