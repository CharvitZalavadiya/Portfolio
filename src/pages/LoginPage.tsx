import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface LoginPageProps {
  animationDirection?: "up" | "down";
}

const LoginPage = ({ animationDirection = "up" }: LoginPageProps) => {
  const [inputValue, setInputValue] = useState("");
  const [dateStr, setDateStr] = useState<string>("");
  const [timeStr, setTimeStr] = useState<string>("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [error, setError] = useState("");
  const [animateOut, setAnimateOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(animationDirection === "down" ? false : true);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setDateStr(`${day}, ${date} ${month}`);
      setTimeStr(time);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (animationDirection === "down") {
      setShow(false);
      setTimeout(() => setShow(true), 10); // trigger reflow for transition
    }
  }, [animationDirection]);

  const handleLogin = () => {
    setAnimateOut(true);
    setTimeout(() => {
      localStorage.setItem("loggedin", "true");
      window.dispatchEvent(new Event("login"));
    }, 600); // match animation duration
  };

  return (
    <div
      className={`w-[100dvw] h-[100dvh] flex items-center-safe relative select-none bg-black overflow-hidden transition-transform duration-700 ease-in-out ${
        animateOut
          ? "-translate-y-full"
          : animationDirection === "down" && !show
          ? "-translate-y-[100vh]"
          : "translate-y-0"
      }`}
    >
      <Image
        src="/loginPage.png"
        alt="Login Background"
        fill
        className={`object-cover z-0 opacity-70 transition-all duration-500 ${
          isInputActive ? "blur-[12px]" : ""
        }`}
        style={{ pointerEvents: "none", userSelect: "none" }}
        priority
      />
      <div className="relative z-10 w-full h-[90%] flex flex-col justify-between items-center">
        <section>
          <div className="font-semibold text-2xl opacity-90">{dateStr}</div>
          <div className="font-semibold text-7xl opacity-90">{timeStr}</div>
        </section>
        <section className="grid place-items-center">
          <div className="my-3">
            <Image
              src="/avatar.jpg"
              alt="Avatar"
              width={72}
              height={72}
              className="rounded-full shadow-lg"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-47 flex items-center">
              <input
                ref={inputRef}
                type="password"
                className="bg-[#d1d1d1] opacity-60 backdrop-blur-xl outline-none p-1 rounded-full pl-3 pr-10 placeholder-gray-500 text-gray-800 w-full"
                placeholder="Enter 0941 to login"
                value={inputValue}
                onFocus={() => setIsInputActive(true)}
                onBlur={() => setIsInputActive(!!inputValue)}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 4);
                  setInputValue(val);
                  setIsInputActive(
                    val.length > 0 || document.activeElement === e.target
                  );
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    inputRef.current?.blur();
                    setIsInputActive(!!inputValue);
                  }
                  if (e.key === "Enter") {
                    if (inputValue === "0941") {
                      handleLogin();
                    } else {
                      setError(
                        "Incorrect Password Please Read the placeholder to login"
                      );
                    }
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-transparent opacity-80 hover:cursor-pointer transition border border-slate-600 shadow p-1"
                tabIndex={-1}
                aria-label="Submit"
                onClick={() => {
                  if (inputValue === "0941") {
                    handleLogin();
                  }
                }}
              >
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </button>
              {error && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max text-gray-400 text-sm font-medium text-center whitespace-nowrap pointer-events-none select-none">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
