const multer = require("multer");
const path = require("path");
const User = require("../model/userModel.js");
const Emp = require("../model/empModel.js");
const bcrypt = require("bcrypt");
const fs = require("fs");
const generateTokenAndSetCookie = require("../lib/generateToken.js");

module.exports.create = async (req, res) => {
  try {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, uploadDir);
      },
      filename: function (req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
      },
    });

    const upload = multer({ storage: storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error uploading file",
          message: err.message,
        });
      }

      try {
        if (req.body.name && req.body.designation && req.body.email) {
          const { name, designation, email } = req.body;
          const newEmployee = new Emp({
            name,
            designation,
            email,
            file: req.file ? req.file.filename : null, 
          });

          await newEmployee.save((err) => {
            if(err){
              res.json({ message: err.message, type: 'danger'})
            } else{
              req.session.message = {
                type: "success",
                message: "Employee Added."
              }
            }
          });
          // req.flash('success', 'Employee created successfully!');
        }

        res.redirect("/");
      } catch (error) {
        return res.status(500).json({
          error: "Error saving employee",
          message: error.message,
        });
      }
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};


module.exports.deleteEmp = async (req, res) => {
  try {
    const employee = await Emp.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found!" });
    }

    if (employee.file) {
      const filePath = path.join(process.cwd(), "uploads", employee.file);

      fs.unlink(filePath, (err) => {
        if (err) {
          return res
            .status(404)
            .json("Error while deleting file:", err.message);
        }
      });
    }

    await Emp.findByIdAndDelete(req.params.id);

    return res.redirect("/");
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Error deleting employee", message: error.message });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, uploadDir);
      },
      filename: function (req, file, callback) {
        callback(null, req.body.filename || file.originalname);
      },
    });

    const upload = multer({ storage: storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error uploading file",
          message: err.message,
        });
      }

      if (!req.body.name || !req.body.designation || !req.body.email) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Name, designation, and email are required",
        });
      }

      try {
        const { name, designation, email } = req.body;
        const employee = await Emp.findById(req.params.id);

        if (!employee) {
          return res.status(404).json({
            error: "Employee not found",
            message: `No employee found with ID ${req.params.id}`,
          });
        }

        employee.name = name;
        employee.designation = designation;
        employee.email = email;

        if (req.file) {
          if (employee.file) {
            const oldFilePath = path.join(uploadDir, employee.file);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }

          employee.file = req.file.filename;
        }

        await employee.save();
        return res.redirect("/");
      } catch (error) {
        return res.status(500).json({
          error: "Error saving employee",
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.redirect("/");

    // return res.status(200).json({ data: user});
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      // res.status(201).json({
      //   _id: newUser._id,
      //   name: newUser.name,
      //   email: newUser.email,
      // });

      return res.redirect("/");
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
