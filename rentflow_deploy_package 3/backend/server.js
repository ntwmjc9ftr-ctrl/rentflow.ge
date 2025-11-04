
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Simple admin user for first login
const ADMIN_EMAIL = 'sabamalakmadze491@gmail.com';
const ADMIN_PASSWORD = 'Ai-10QVr15QjK-SF'; // change in production!

app.post('/api/admin/login', (req,res) => {
  const {user, pass} = req.body;
  if (user === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
    const token = jwt.sign({user}, JWT_SECRET, {expiresIn: '7d'});
    return res.json({token});
  }
  return res.status(401).json({error:'Unauthorized'});
});

function verifyJWT(req,res,next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({error:'no token'});
  const token = h.split(' ')[1];
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch(e) { return res.status(401).json({error:'invalid'}); }
}

// Upload property (protected)
app.post('/api/properties', verifyJWT, upload.array('photos', 12), (req,res) => {
  const {title, price, status} = req.body;
  const photos = (req.files||[]).map(f=>('/uploads/'+path.basename(f.path)));
  // For demo, save to JSON file
  const dbFile = path.join(__dirname, 'db.json');
  let db = {properties:[]};
  if (fs.existsSync(dbFile)) db = JSON.parse(fs.readFileSync(dbFile));
  const id = Date.now();
  db.properties.push({id, title, price, status, photos});
  fs.writeFileSync(dbFile, JSON.stringify(db,null,2));
  res.json({ok:true});
});

// Public properties
app.get('/api/properties', (req,res) => {
  const dbFile = path.join(__dirname, 'db.json');
  if (!fs.existsSync(dbFile)) return res.json([]);
  const db = JSON.parse(fs.readFileSync(dbFile));
  res.json(db.properties);
});

// Contact (send email placeholder)
app.post('/api/contact', (req,res) => {
  // In production: send via SendGrid or SMTP
  console.log('Contact message', req.body);
  res.json({ok:true});
});

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Server listening on', port));
