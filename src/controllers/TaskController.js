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
          const a = "A";
        res.render('tasks/index', { a, tasks });
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
      res.render('tasks/index', { sector, resul });
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

  function edit(req, res) {
    const id = req.params.id;
      pool.query('SELECT * FROM propuestas WHERE id = $1', [id], (err, prop) => {
        if(err) {
          res.json(err);
        }
        else{
          const props = prop.rows
        res.render('tasks/edit', { props });
        }
      });
  
  }

  function update(req, res) {
    const id = req.params.id;
    const { title, description } = req.body;
    const query = `UPDATE propuestas SET title = '${title}', description = '${description}' WHERE id = ${id};`
    console.log(query)
    pool.query(query, (err, prop) => {
        if(err) {
          res.json(err);
        }
        else{
        res.redirect(`/view/${id}`);
        }
      });
  
  }

  function proposal(req, res) {
    const sector = req.params.sector;
    console.log(sector);
    res.render('tasks/proposal', { sector });
  
  }

  function inicio(req, res) {
    res.redirect('/');
  
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

  function storeProposal(req, res) {
    const { title, description, segment } = req.body
    const sector = req.params.sector;
    pool.query('INSERT INTO propuestas (title, description, sector, segment) values ($1, $2, $3, $4)', [title, description, sector, segment], (err, results) => {
      if(err) {
        throw err;
      }
      else{
        res.redirect(`/obtenerprop/${sector}`);
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
  
  
  function view(req, res) {
    const id = req.params.id;
      pool.query('SELECT * FROM propuestas WHERE id = $1', [id], (err, prop) => {
        if(err) {
          res.json(err);
        }
        else{
          const props = prop.rows
        res.render('tasks/view', { props });
        }
      });

  }

  function vote (req, res) {
    const id = req.params.id;
    pool.query(`UPDATE propuestas SET votos = votos + 1 WHERE id = ${id};`, (err, tasks) => {
      if(err) {
        throw err;
      }
      else{
        res.redirect(`/view/${id}`);
      }
      
    });
  }

  function listar (req, res) {
    const id = req.params.id;
    pool.query(`SELECT * FROM propuestas;`, (err, tasks) => {
      if(err) {
        throw err;
      }
      else{
        //res.redirect(`/view/${id}`);
        res.json(tasks.rows)
      }
      
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

function prueba(req, res) {
    pool.query('UPDATE propuestas SET description = prueba WHERE id = 9;', (err, tasks) => {
      if(err) {
        throw err;
      }
      else{
        res.status(200).json("Prueba")
      }
      
    });
} 

function propuestas(req, res) {
  pool.query('ALTER TABLE propuestas RENAME COLUMN votes TO votos;', (err, tasks) => {
    if(err) {
      throw err;
    }
    else{
      res.status(200).json("Creada")
    }
    
  });
}

function votes (req, res) {
  pool.query('UPDATE propuestas SET votos = 0;', (err, tasks) => {
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

function resetp(req, res) {
  pool.query('DELETE FROM propuestas; ALTER SEQUENCE propuestas_id_seq RESTART WITH 1;', (err, tasks) => {
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
    tabla: tabla,
    reset:reset,
    propuestas:propuestas,
    obtenerPropuestas:obtenerPropuestas,
    login:login,
    prop:prop,
    inicio:inicio,
    proposal:proposal,
    storeProposal:storeProposal,
    view:view,
    edit:edit,
    update:update,
    prueba:prueba,
    votes:votes,
    vote:vote,
    listar:listar,
    resetp:resetp
  }