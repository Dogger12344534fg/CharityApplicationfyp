import picture from './assets/dd.jpg'

function ppi(){
  const handleclick = (e)=> e.target.style.display="none";
  return(<img onClick ={(e)=>handleclick(e)} src={picture} alt ="this isme"></img>);
}
export default ppi