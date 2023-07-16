module.exports.setFlash = async (req, res, next) => {
    try {
      res.locals.flash = {
        success: req.flash("success"),
        error: req.flash("error"),
      };
  
      next();
    } catch (error) {
      console.log("Error in setting flash messages:", error);
     
      next(error);
    }
  };
  