export default function GitHub() {
  return (
    <div className="w-full h-full">
      <div className="h-full w-full p-0 rounded-lg overflow-hidden flex items-center justify-center" style={{height: '100%', width: '100%'}}>
        <div style={{textAlign: 'center', color: '#9ca3af', fontSize: 18, padding: 24}}>
          <div style={{fontWeight: 600, fontSize: 22, marginBottom: 8}}>
            Charvit Zalavadiya's GitHub
          </div>
          <div style={{marginBottom: 16}}>
            <a
              href="https://github.com/CharvitZalavadiya"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: '#3b82f6', textDecoration: 'underline'}}
            >
              github.com/CharvitZalavadiya
            </a>
          </div>
          <div style={{fontSize: 15, opacity: 0.7}}>
            GitHub does not allow embedding its site in an iframe.<br/>
            Please click the link above to view the profile.
          </div>
        </div>
      </div>
    </div>
  );
}
