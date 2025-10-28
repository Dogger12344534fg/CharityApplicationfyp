import PropTypes from 'prop-types';
function UserGreeting(props){
  
  const welcomeMessage = <h2>Hello it is me</h2>
  const errorMessage = <h2>Try again</h2>

  return (props.isLoggedIn ? welcomeMessage : errorMessage)
}
UserGreeting.proptypes = {

  isLoggedIn:PropTypes.bool,
  name:PropTypes.string,
}

UserGreeting.defaultProps ={
  Name :"deep",
  isLoggedIn:false,
}

export default UserGreeting