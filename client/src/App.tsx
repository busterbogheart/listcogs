import {CSSProperties, EffectCallback, useEffect, useState} from 'react';
import {Header} from './components/Header';
import './index.css'

type TokenRes = {
  access_token:string,
  expires_in:number,
  token_type:string
}

export default () => {
  const [msg, setMsg] = useState('ready')
  useEffect( ()=>{
    const asyncme = async() => {
      const res:Response = await fetch('http://localhost:8000/test');
      const data:TokenRes = await res.json();
      setMsg(data.access_token);
    }
    
    asyncme();
  }, [])
  
  
  return (
    <div className='App'>
      <Header what='no'/>
      <Header what='no'/>
      {msg}
    </div>
  );
}
