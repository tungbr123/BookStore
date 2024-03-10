class MenuDashboard extends React.Component {
  render() {
    return (
      <div class="fhs-header-top-second-bar">
        <FahasaLogo />
      </div>
    );
  }
}
class FahasaLogo extends React.Component{
  render(){
    return(
      <div class="fhs_mouse_point" onclick="location.href = '/';" id="logoFahasa" title="FAHASA.COM">        
        <img src="images/fahasa-logo.png" />
      </div>
    )
  }
}

ReactDOM.render(
  <MenuDashboard />,
  document.getElementById('content')
);
