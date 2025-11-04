import React, {useState} from 'react'
export default function Admin() {
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const submit = async e => {
    e.preventDefault();
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000') + '/api/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user: email, pass})
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('rentflow_token', data.token);
      alert('Logged in — change password immediately via backend API or admin UI.');
    } else alert('Login failed');
  }
  return (<div style={{padding:40}}>
    <h2>Admin Login</h2>
    <form onSubmit={submit}>
      <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder='password' type='password' value={pass} onChange={e=>setPass(e.target.value)} />
      <button type='submit'>Login</button>
    </form>
    <p>Default admin: sabamalakmadze491@gmail.com</p>
  </div>)
}
