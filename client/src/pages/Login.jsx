import { useState, useContext } from "react"; //useState->React hook to store data inside component
//useContext->access global auth(to read data from global Context store )
import API from "../api/axios"; //Used to send request to backend
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; //navigate to a different component or page
import { useEffect } from "react"; //A React hook that runs code AFTER the component renders.
import { toast } from "react-toastify";

const Login = () => {
  //React function component it return ui
  const { user, login, logout } = useContext(AuthContext); //Gets values from global AuthContext.
  const navigate = useNavigate(); //useNavigate() is a hook from React Router that gives you a function called navigate.to move user from one page to another

  const [email, setEmail] = useState(""); //create email state of user initially empty string
  const [password, setPassword] = useState(""); //create password state of user initially empty string

  useEffect(() => {
    if (user) {

    if (user?.role === "admin") {

      navigate("/admin");

    } else {

      navigate("/dashboard");

    }

  }
  }, [user, navigate]); //react dependency array->user=run this effect when user changes, navigate
  //navigate=used inside useeffect → must be declared in dependency array

  ///////////////////////////////login handler function///////////////////////////

  const handleLogin = async (e) => {
    //Function runs when user clicks Login button

    // Without preventDefault(): Click Login → page reloads instantly
    // With preventDefault():Click Login → run handleLogin() only
    e.preventDefault(); //prevent component from reloading when user click submit

    try {
      const res = await API.post("/users/login", {
        //Send request to backend and get response(res)
        email,
        password,
      });
      console.log(res.data);

      login(res.data.user, res.data.token); //call this function ->store user,token in localstorage and global context auth

      toast.success(`Welcome ${res.data.user.name}`);

    if (res.data.user?.role === "admin") {

  navigate("/admin");

} else {

  navigate("/dashboard");

}
    } catch (error) {
      //error handle
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////

  return (
  <div className="min-h-screen bg-[#F1C93B] flex items-center justify-center px-4">
    
    <div className="w-full max-w-md bg-[] rounded-3xl shadow-2xl p-8 bg-white/35 backdrop-blur-xl">

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-[#1A5D1A]  mb-5">
          EduNest
        </h2>

        <p className="text-[#1A5D1A]  font-semibold mt-2 text-left text-3xl">
          Login 
        </p>
      </div>

      {/* Welcome User */}
      {user && (
        <div className="mb-4 text-center">
          <h3 className="text-green-600 font-semibold">
            Welcome, {user.name}
          </h3>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block mb-2 text-black font-small font-semibold">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#1A5D1A] rounded-xl placeholder:text-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#1A5D1A]"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-black font-small font-semibold">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border[#1A5D1A]-300 rounded-xl placeholder:text-black px-4 py-3 outline-none focus:ring-2 focus:ring-[#1A5D1A]"
          />
        </div>

        <div className="flex justify-end">
  <span
    onClick={() => navigate("/forgot-password")}
    className="text-[#1A5D1A] font-bold cursor-pointer hover:underline"
  >
    Forgot Password?
  </span>
</div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#1A5D1A] hover:bg-[#50e306] transition duration-300 text-[#F1C93B] py-3 rounded-xl font-semibold text-2xl"
        >
          Login
        </button>

      </form>

      {/* Register Link */}
      <p className="text-center text-[#000000] font-semibold mt-6">
        Don&apos;t have an account?{" "}

        <span
          className="text-[#1A5D1A] font-bold cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>

      {/* Logout Button */}
      {user && (
        <button
          onClick={logout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
        >
          Logout
        </button>
      )}
    </div>
  </div>
);
};

export default Login;

//flow is user login -> then user , token stored in both Authcontext(which dissappears if app refresh) and localstorage (cannot delete token,user until we delete them from localstorage)
//so when app refresh authcontext data delete but then again take user,token from local storage and app work
//during logout ->delete user,token from both authcontext and localstorage as if we do not delete form local storage then again when app open authcontext get user,token from local storage
