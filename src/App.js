import React,{useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

function App() {
  const socket=io('http://localhost:5100')
  const[username,setusername]=useState('');
  const[active,setactive]=useState(false);
  const[message,setmessage]=useState([]);
  const[newmessage,setnewmessage]=useState('')
  const[scnduser,setscnduser]=useState('');
  useEffect(() => {
    socket.on('received-message', (receivedMessage) => {
      setmessage(prevMessages => [...prevMessages, receivedMessage]);
    });
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('received-message');
    };
  }, [socket]);
  
  
  return (
    <div className="App">
     {
      //chat is here
      active?(<div>
        <div>Squad chat</div>
        <div>
          {
            message.map((msg,index)=>{
              return <div key={index}>
                    <span>{msg.user}</span>
                    <div>{msg.message}</div>
                    <span>{msg.time}</span>
                    <span>here</span>
              </div>
            })
          }
        </div>
        <form onSubmit={(e)=>{
          e.preventDefault();
          const messagedata={
            message:newmessage,
            user:username,
            time:new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
            scnduser:scnduser
          }
          socket.emit('send-message', messagedata
          );
        }}>
          <input type='text' id='msg' onChange={(e)=>{
            setnewmessage(e.target.value)
          }}/>
          <button type='submit' />
        </form>
      </div>):(<div>
        <input type='text' id='user' placeholder='type username' onChange={(e)=>{
            setusername(e.target.value)
        }}/>
        <input type='text' placeholder='select second user' onChange={(e)=>{
          setscnduser(e.target.value)
        }}/>
        <button type='submit' onClick={()=>{
          if(!username && !scnduser){
            window.location='./'
          }else{
            setactive(true);
          }
        }}>Start chat</button>
      </div>)
     }
    </div>
  );
}

export default App;
