const express = require('express');
const TaskController = require('../controllers/TaskController');
const router = express.Router();
router.post('/', TaskController.login);
router.get('/tabla', TaskController.tabla);
router.get('/obtenerprop/:sector', TaskController.obtenerPropuestas);
router.post('/prop', TaskController.prop);
router.get('/propuestas', TaskController.propuestas);
router.get('/reset', TaskController.reset);
router.get('/register', TaskController.register);
router.post('/register', TaskController.store);
router.get('/tasks', TaskController.index);
router.post('/tasks/delete', TaskController.destroy);
router.get('/tasks/edit/:id', TaskController.edit);
router.post('/tasks/edit/:id', TaskController.update);

module.exports = router;