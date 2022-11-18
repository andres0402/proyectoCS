const Pool = require('pg').Pool;
var window = require('window');
const pool = new Pool({
  user: 'jppmyypruwpmlu',
  host: 'ec2-44-206-197-71.compute-1.amazonaws.com',
  database: 'dcjb0havcs34tk',
  password: '1b7b36c11a5a4a34c331bb7bb317a05a28c1c753cafb213abe1c1d7f0c73253e',
  port: 5432, 
  ssl: {
    rejectUnauthorized: false
  }
  /*connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }*/
});

function index(req, res) {
    
      pool.query('SELECT * FROM propuestas', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        else{
          tasks = tasks.rows;
        res.render('tasks/index', { tasks });
        }
      });
    
  }

  function obtenerPropuestas(req, res){
    const sector = req.params.sector;
    let resul = pool.query('SELECT * FROM propuestas WHERE sector = $1', [sector] , (err, results) => {
      if(err) {
        res.json(err);
      }
      else{
        results = results.rows;
      }
      var resul = results;
      res.render('tasks/index', { resul });
    });
  }

  function login(req, res) {
    const { email, password } = req.body;
    
    
    pool.query('SELECT * FROM usuarios WHERE email = $1  AND password = $2', [email, password] , (err, tasks) => {
      if(err) {
        res.json(err);
      }
      else{
        tasks = tasks.rows;
        if(tasks.length == 0){
          res.redirect('/')
        }
        else{
          const sector = tasks[0].sector;
          res.redirect(`/obtenerprop/${sector}`)
        }
      }
    });
  
}




  
  function register(req, res) {
    res.render('tasks/create');
  
  }


  
  function store(req, res) {
    const { name, lastname, email, password, sector, segment } = req.body
    pool.query('INSERT INTO usuarios (name, lastname, email, password, sector, segment) values ($1, $2, $3, $4, $5, $6)', [name, lastname, email, password, sector, segment], (err, results) => {
      if(err) {
        throw err;
      }
      else{
        res.redirect('/');
      }
      
    });
  }

  function prop(req, res) {
    const { title, description, files, sector, segment } = req.body;
    pool.query('INSERT INTO propuestas (title, description, files, sector, segment) values ($1, $2, $3, $4, $5);', [title, description, files, sector, segment], (err, results) => {
      if(err) {
        throw err;
      }
      else{
        res.json("Agregado");
      }
      
    });
  }
  
  function destroy(req, res) {
    const id = req.body.id;
  
    req.getConnection((err, conn) => {
      conn.query('DELETE FROM taskss WHERE id = ?', [id], (err, rows) => {
        res.redirect('/tasks');
      });
    })
  }
  
  function edit(req, res) {
    const id = req.params.id;
  
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM taskss WHERE id = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('tasks/edit', { tasks });
      });
    });
  }
  
  function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    req.getConnection((err, conn) => {
      conn.query('UPDATE taskss SET ? WHERE id = ?', [data, id], (err, rows) => {
        res.redirect('/tasks');
      });
    });
  }

  
  function tabla(req, res) {
    pool.query('SELECT * FROM usuarios', (err, tasks) => {
      if(err) {
        throw err;
      }
      else{
        res.status(200).json(tasks.rows)
      }
      
    });
}

function propuestas(req, res) {
  pool.query('CREATE TABLE propuestas (id SERIAL PRIMARY KEY, title VARCHAR(50), description VARCHAR(200), files VARCHAR(100), sector VARCHAR(50), segment VARCHAR(50));', (err, tasks) => {
    if(err) {
      throw err;
    }
    else{
      res.status(200).json("Creada")
    }
    
  });
}

  
function reset(req, res) {
  pool.query('DELETE FROM usuarios; ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;', (err, tasks) => {
    if(err) {
      throw err;
    }
    else{
      res.status(200).json("Eliminados")
    }

  });

  
}
  
  module.exports = {
    index: index,
    register: register,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
    tabla: tabla,
    reset:reset,
    propuestas:propuestas,
    obtenerPropuestas:obtenerPropuestas,
    login:login,
    prop:prop
  }