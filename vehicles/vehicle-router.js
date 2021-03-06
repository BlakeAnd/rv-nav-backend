const router = require('express').Router();
const Vehicle = require('./vehicle-model');
const protectedRoute = require('../auth/gen-token.js').protectedRoute;

// ADD A vehicle
router.post('/', protectedRoute, (req, res) => {
  // users id lives on the subject key from the token they provide
  const { subject } = req.decodedToken;
  if (!subject) {
    res.status(400).json({
      message: 'must provide a valid user id'
    });
  } else {
    Vehicle.add({ ...req.body, user_id: subject }).then(vehicle => {
      res.status(201).json(vehicle);
    });
  }
});

// GET VEHICLE
router.get('/', protectedRoute, (req, res) => {
  // users id lives on the subject key from the token they provide
  const { subject } = req.decodedToken;
  Vehicle.findUsersVehicles(subject).then(vehicles => {
    res.json(vehicles);
  });
});

// GET SINGLE vehicle
router.get('/:id', protectedRoute, (req, res) => {
  const { id } = req.params;
  // users id lives on the subject key from the token they provide
  const { subject } = req.decodedToken;
  Vehicle.findById(id)
  .then(vehicle => {
    if (subject == vehicle.user_id) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'No vehicle by that id' });
    }
  })
  .catch(err => res.status(404).json({ message: 'No vehicle by that id' }));
});

// Update vehicle
router.put('/:id', protectedRoute, (req, res) => {
  const changedVehicle = req.body;
  const { id } = req.params;
  // users id lives on the subject key from the token they provide
  const { subject } = req.decodedToken;
  Vehicle.findById(id)
  .then(vehicle => {
    if (subject == vehicle.user_id) {
      Vehicle.updateVehicle(id, changedVehicle).then(count =>
        res.json(count)
        );
      } else {
        res.status(404).json({ message: 'No vehicle by that id' });
      }
    })
    .catch(err => res.status(404).json({ message: 'No vehicle by that id' }));
  });
  
// Delete vehicle
router.delete('/:id', protectedRoute, (req, res) => {
  const { id } = req.params;
  // users id lives on the subject key from the token they provide
  const { subject } = req.decodedToken;
  Vehicle.findById(id)
    .then(vehicle => {
      if (subject == vehicle.user_id) {
        Vehicle.deleteVehicle(id).then(count => res.json(count));
      } else {
        res.status(404).json({ message: 'No vehicle by that id' });
      }
    })
    .catch(err => res.status(404).json({ message: 'No vehicle by that id' }));
});

module.exports = router;
