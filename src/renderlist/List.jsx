import PropTypes from 'prop-types';
function List (props){

  // fruits.sort((a,b) => a.name.localeCompare(b.name));
  const catgory = props.category;
  const itemlist = props.items;
  const listItems = itemlist.map(item => <li key = {item.id}>{item.name}:<b>{item.cal}</b></li>)
  return(<>
  <h2 className="list-cat">{catgory}</h2>
  <ol className="list-items">{listItems}</ol>
  </>);
}

List.PropTypes={
  category :PropTypes.string,
  Items:PropTypes.arrayOf(  PropTypes.shape({id: PropTypes.number,
    name: PropTypes.string,
    cal:PropTypes.number
  }))


}

List.defaultProps={
  category:"category",
  item:[],

}

export default List