const HomePage = () => {
  const handleSleep = () => {
    localStorage.setItem('loggedin', 'false');
    // Trigger a custom event to notify the parent component about logout
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <>
      <div>Home Page</div>
      <button onClick={handleSleep}>Sleep</button>
    </>
  );
};

export default HomePage;