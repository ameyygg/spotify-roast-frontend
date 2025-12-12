import axios from 'axios';

const handleLogin = async (e) => {
    e.preventDefault();

    window.location.href = 'https://spotify-roast-backend.onrender.com/api/auth/login';
}

const Login = () => {
  return (
    <div>
        <h1 className='font-black text-4xl mb-5'>Login with Spotify and get Roasted!</h1>
        <button className='bg-green-700 hover:bg-green-900 p-3 rounded-lg' onClick={handleLogin}>Login with Spotify</button>
    </div>
  )
}

export default Login
