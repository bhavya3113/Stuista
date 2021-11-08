const User = require("../models/users");
const Course = require("../models/course");

exports.allCourses=(req,res,next)=>{
  Course.find({})
  .populate('instructorDetails','fullname email')
  .then(course=>{
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching allcourses", error);
  })
}

exports.categorywise=(req,res,next)=>{
  const categorywiseCourses = req.params.category;
  Course.find({category:categorywiseCourses})
  .populate('instructorDetails','fullname email')
  .then(course=>{
    // console.log(categorywiseCourses);
    res.status(200).json(course);
  })
  .catch(error=>{
    res.status(500).json("error in fetching category-wise courses", error);
  })
}

exports.addCourse=(req,res,next)=>{
  const title = req.body.title;
  const category = req.body.category;
  const duration = req.body.duration;
  const preRequisites = req.body.preRequisites;
  const introduction = req.body.introduction;
  const description = req.body.description;
  const instructorName = req.body.instructorName;
  const price = req.body.price;
  const language = req.body.language;
  const skillsLearned = req.body.skillsLearned;
  const instructorDetails = req.userId;
  const image = req.file;
  const imageUrl = image.path;
  // console.log(image);
  // console.log(instructorDetails);

  const course =new Course({
   title: title,
   category: category,
   duration: duration,
   preRequisites: preRequisites,
   introduction: introduction,
   description: description,
   instructorName: instructorName,
   price: price,
   language: language,
   skillsLearned: skillsLearned,
   instructorDetails: instructorDetails,
   imageUrl: imageUrl
  });
  course.save()
  .then(course=>{
    res.status(201).json({message:'course created', course });
  })
  .catch(err=>{
    res.status(400).json({'Error in adding Course': err})
  })
}

exports.addtocart=(req,res,next)=>{
  const userId = req.userId;
  const courseId = req.params.courseid;

  // console.log(userId , courseId);
  User.findById(userId)
  .then(user=>{
    const index = user.cart.findIndex(courseid => courseId==courseid)
    if(index==-1)
    {
      user.cart.push(courseId);
      user.save();
    }
    else{
      return res.status(400).json('Already in cart');
    }
     return res.status(200).json('Added to cart');
    })
  .catch(err=>{
    console.log("error in adding to cart", err);
     res.status(400).json({ 'Error in adding to cart': err });
  })
  }

  exports.removefromcart=(req,res,next)=>{
    const userId =  req.userId;
    const courseId = req.params.courseid;
  
    User.findById(userId)
    .then(user=>{
      const index = user.cart.findIndex(courseid => courseId==courseid)
      if(index==-1)
      {
       return res.status(400).json('Not in cart');
      }
     else
     {
      user.cart.splice(index,1);
      user.save(); 
     }
     return res.status(200).json('Removed from cart');
    })
    .catch(err=>{
      console.log("error in removing from cart", err);
      res.status(400).json({ 'Error in removing from cart': err });
    })
    }

    exports.Cart =(req,res,next)=>{
      const userId = req.params.userid;
      User.findById(userId)
      // User.findById({'_id': '6182558da75d18d6f2964024'})
      .populate('cart')
      .exec()
      .then(user => {
        const course = user.cart;
        res.status(200).json({'Your Cart':course});
      })
    .catch(err=>{
      console.log("error in displaying cart", err);
      res.status(400).json({ 'Error in displaying cart': err });
    })
    }

    exports.addtofav=(req,res,next)=>{
      const userId = req.userId;
      const courseId = req.params.courseid;
    
      // console.log(userId , courseId);
      User.findById(userId)
      .then(user=>{
        const index = user.favourites.findIndex(courseid => courseId==courseid)
        if(index==-1)
        {
          user.favourites.push(courseId);
          user.save();
        }
        else{
          return res.status(400).json('Already in favourites');
        }
         return res.status(200).json('Added to favourites');
        })
      .catch(err=>{
        console.log("error in adding to favourites", err);
         res.status(400).json({ 'Error in adding to favourites': err });
      })
      }
    
      exports.removefromfav=(req,res,next)=>{
        const userId = req.userId;
        const courseId = req.params.courseid;
      
        User.findById(userId)
        .then(user=>{
          const index = user.cart.findIndex(courseid => courseId==courseid)
          if(index==-1)
          {
           return res.status(400).json('Not in favourites');
          }
         else
         {
          user.favourites.splice(index,1);
          user.save(); 
         }
         return res.status(200).json('Removed from favourites');
        })
        .catch(err=>{
          console.log("error in removing from favourites", err);
          res.status(400).json({ 'Error in removing from favourites': err });
        })
        }
    
        exports.fav =(req,res,next)=>{
          const userId = req.params.userid;
          User.findById(userId)
          .populate('favourites')
          .exec()
          .then(user => {
            const course = user.favourites;
            res.status(200).json({'Your favourites':course});
          })
        .catch(err=>{
          console.log("error in displaying favourites", err);
          res.status(400).json({ 'Error in displaying favourites': err });
        })
        }