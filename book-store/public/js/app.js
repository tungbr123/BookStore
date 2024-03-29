class MenuDashboard extends React.Component {
  render() {
    return (
      <NavigationBar />
    );
  }
}


class FahasaLogo extends React.Component{
  render(){
    return(
      <div>        
          <img id="logoFahasa"src="images/fahasa-logo.png" >
      </img></div>             
    )
  }
}

class NavigationBar extends React.Component{
  render(){
    return(
    <div>
      <nav class="navbar navbar-inverse">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">WebSiteName</a>
          </div>
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li>
              <a class="dropdown" href="#">Category
                <CategoryList />
              </a>

            </li>
            <li><a href="#">Page 2</a></li>
          </ul>
          <form class="navbar-form navbar-left" action="/action_page.php">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search" name="search"/>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
          </form>
        </div>
      </nav>
    </div>          
    )
  }
}
class CategoryList extends React.Component{
  render(){
    return(
      <ul class="dropdown-content">
        <li><a href="#">Link 1</a></li>
        <li><a href="#">Link 2</a></li>
        <li><a href="#">Link 3</a></li>
      </ul>
    )
  }
}
ReactDOM.render(
  <MenuDashboard />,
  document.getElementById('content')
);
