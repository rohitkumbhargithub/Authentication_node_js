const express = require('express');
const router = express.Router();
const protectRoute = require("../middleware/protectRoute.js");
const authController = require('../controllers/authContoller.js');
const Emp = require('../model/empModel.js');

router.get('/create', protectRoute, (req, res) => {
    const isAuthenticated = !!req.user;
    return res.render("createEmp", { isAuthenticated: isAuthenticated, message: req.flash('message')});
})

router.post('/create', protectRoute, authController.create);

router.post('/emp/:id', protectRoute, authController.deleteEmp);
router.post('/edit/:id', protectRoute, authController.edit);

router.get('/', protectRoute, async (req, res) => {
    try {
      const employees = await Emp.find({});
      const isAuthenticated = !!req.user; 
      
      res.render("home", { 
        employees: employees, 
        isAuthenticated: isAuthenticated,
        message: req.flash('message'), 
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching employees", message: error.message });
    }
  });
  


router.get('/edit/:id', protectRoute, async (req, res) => {
    try {
        const employee = await Emp.findById(req.params.id);
        const isAuthenticated = !!req.user;

        return res.render("editEmp", { employee: employee, isAuthenticated: isAuthenticated, message: req.flash('message')  });
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching employee",
            message: error.message,
        });
    }
});

router.get('/sign-in', (req, res) => {
    return res.render("signin", { message: req.flash('message') })
})

router.post('/sign-in', authController.signin);

router.get('/sign-up', (req, res) => {
    return res.render("signup", { message: req.flash('message') })
});

router.post('/sign-up', authController.signup);

router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); 
    res.locals.isAuthenticated = false; 
    req.flash('message', 'Logged Out!');  
    res.render("signin", { message: req.flash('message') });
    res.redirect('/sign-in');  
});

module.exports = router;    