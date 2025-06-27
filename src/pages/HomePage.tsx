import StatusBar from "../components/StatusBar";

const HomePage = () => {
  const handleSleep = () => {
    localStorage.setItem('loggedin', 'false');
    // Trigger a custom event to notify the parent component about logout
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <>
      <StatusBar />
      <div className="relative w-[100dvw] h-[100dvh] overflow-hidden flex items-center justify-center">
        {/* <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <button onClick={handleSleep}>Sleep</button>
        </div> */}
      </div>
    </>
  );
};

export default HomePage;