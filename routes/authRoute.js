const express = require('express');
const router = express.Router();
const protectRoute = require("../middleware/protectRoute.js");
const authController = require('../contollers/authContoller.js');
const Emp = require('../model/empModel.js');

router.get('/create', protectRoute, (req, res) => {
    const isAuthenticated = !!req.user;
    return res.render("createEmp", { isAuthenticated: isAuthenticated  });
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
        isAuthenticated: isAuthenticated 
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching employees", message: error.message });
    }
  });
  


router.get('/edit/:id', protectRoute, async (req, res) => {
    try {
        const employee = await Emp.findById(req.params.id);
        const isAuthenticated = !!req.user;

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found",
                message: `No employee found with ID ${req.params.id}`,
            });
        }

        return res.render("editEmp", { employee: employee, isAuthenticated: isAuthenticated  });
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching employee",
            message: error.message,
        });
    }
});

router.get('/sign-in', (req, res) => {
    return res.render("signin")
})

router.post('/sign-in', authController.signin);

router.get('/sign-up', (req, res) => {
    return res.render("signup")
});

router.post('/sign-up', authController.signup);

router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); 
    res.locals.isAuthenticated = false; 
    res.redirect('/sign-in'); 
});

module.exports = router;    