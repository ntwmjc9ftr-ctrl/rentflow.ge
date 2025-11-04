import Link from 'next/link'
export default function Home(){
  return (
    <div style={{fontFamily:'Inter, Arial', padding:40}}>
      <h1>RENTFLOW</h1>
      <p>You earn income — we manage the rest.</p>
      <p><Link href='/admin'>Admin panel</Link></p>
    </div>
  )
}
