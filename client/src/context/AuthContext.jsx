//React Context API is a way to share data across many components/pages without passing props manually at every level.

//This file does:✅ Stores logged-in user,✅ Stores token,✅ Makes both available to all pages/components

import { createContext, //Used to create a shared global data container.
    useState //Used to store changing data like:user , token
} from "react";

export const AuthContext = createContext();//Creates a context object(shared container) named AuthContext.


const AuthProvider = ({ children }) => {//Creates a component called AuthProvider. children->Means whatever components you wrap inside it.
  
    const [user, setUser] = useState(//Creates user state variable: 
    JSON.parse(localStorage.getItem("user")) || null//.parse -> convert string to object,if null(means nothing stored means no logged in user)
  );

  const [token, setToken] = useState(//create token state
    localStorage.getItem("token") || null//get token from local storage
  );

   const login = (userData, tokenData) => {//input parameters come from Login jsx where it is called
    setUser(userData);//Updates React state with logged-in user.
    setToken(tokenData);//Updates token state.

    localStorage.setItem("user", JSON.stringify(userData));//Saves user in browser storage permanently.
    localStorage.setItem("token", tokenData);//Saves token in localStorage.
  };

  const logout = () => {//Function runs when user clicks logout.
    setUser(null);//Clears React states
    setToken(null);

    localStorage.removeItem("user");//Removes saved login data from browser.so that when we reopen app then authcontext find null in locaslstorage and cannot login(data from localstorage) without login 
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider  //This supplies shared data to all child components.
      value={{          //All wrapped components can access:user,setuser,token, settoken
        user,
        setUser,
        token,
        setToken,
        login,
        logout
      }}
    >
      {children}  {/*Render the wrapped children inside the AuthContext provider so they can use auth data.*/}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


// Now any page can use:
// current user
// token
// logout
// role

// without checking localStorage everywhere.