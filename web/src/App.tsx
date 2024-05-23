import { BrowserRouter, Redirect, Route, RouteProps, Switch } from "react-router-dom";
import { GlobalStyles } from "./components/GlobalStyles";
import { Layout } from "./components/Layout";
import { Loading } from "./components/Loading";
import { isAuthenticated, usePrepareApp } from "./helper/auth";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

function App() {
  const {isLoading} = usePrepareApp();  //Episode 6
//Basically we know the usePrepareApp function returns isLoading to false...hence if it is still true then we return the loading page and when it is false it moves on.
  if(isLoading){  
    return <Loading/>
  }
  return (
  <BrowserRouter>
    <GlobalStyles/>
    <Layout>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <AuthRoute path="/" component={Home}/>
      </Switch>
    </Layout>
  </BrowserRouter>
  );
}

const AuthRoute = (props: RouteProps) => {
  if(isAuthenticated()){
    return <Route {...props}/>
  }
  return <Redirect to='/login'/>
}

export default App;
