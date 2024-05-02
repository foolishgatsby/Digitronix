import React, { useEffect, useState } from "react";
import img from "./../../assets/img/LandingPageCarousel_4.jpg";
import Logo from "../../assets/img/Logo.png";
import { loginApi } from "../../redux/reducers/LoginReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ROLE } from "../../utils/constants/settingSystem";


export default function Login(props) {
  const [userLogin, setUserLogin] = useState({
    username: "",
    password: "",
  });

  const { userLoginInfo } = useSelector((state) => state.LoginReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };
  // console.log(userLogin);
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("submit");
    dispatch(loginApi(userLogin));
  };

  useEffect(() => {
    if (!userLoginInfo.token) {
      navigate("/");
    } else {
      switch (userLoginInfo.roleId) {
        case ROLE.DIRECTOR.id:
          navigate("/admin");
          break;
        case ROLE.WAREHOUSE.id:
          navigate("/warehouse");
          break;
        case ROLE.SALE.id:
          navigate("/sale");
          break;
        default:
          break;
      }
    }
  }, [userLoginInfo.token]);

  return (
    <div className="grid grid-cols-10 h-screen">
      <div className="md:col-span-4 sm:col-span-12">
        <div className="inline-block w-full h-1/4 bg-[#FFD700] relative">
          <img
            src={Logo}
            alt="logo"
            className="absolute"
            style={{
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%) translateY(50%)",
            }}
          />
        </div>
        <form className="space-y-6 mt-20 mx-40" onSubmit={handleSubmit}>
          <h3 className="text-center font-bold text-4xl">WELCOME</h3>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="text-sm flex justify-end">
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
      <div
        className="sm:hidden md:block col-span-6"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
